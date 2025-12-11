// Importar conexión de la BD
const connection = require('../config/connection');

/* Aquí se validan los campos al crear un boardgame */
function validarCamposCrear(boardgame) {
  const errores = [];
  const { Name, Publisher, Category, Description, Year } = boardgame;

  if (!Name || !Name.trim()) {
    errores.push("El nombre es obligatorio");
  }
  if (!Publisher || !Publisher.trim()) {
    errores.push("El publisher es obligatorio");
  }
  if (!Category || !Category.trim()) {
    errores.push("La categoría es obligatoria");
  }
  if (Name && Name.length > 80) {
    errores.push("El nombre no debe superar 80 caracteres");
  }
  if (Publisher && Publisher.length > 60) {
    errores.push("El publisher no debe superar 60 caracteres");
  }
  if (Category && Category.length > 2) {
    errores.push("La categoría no debe superar 2 caracteres");
  }
  if (Description && Description.length > 200) {
    errores.push("La descripción no debe superar 200 caracteres");
  }
  if (Year && Year.toString().length > 4) {
    errores.push("El año no debe superar 4 caracteres");
  }
  return errores;
}

/* Aquí se validan los campos al editar un boardgame */
function validarCamposEditar(boardgame) {
  const errores = [];
  const { Publisher, Category, Description, Year } = boardgame;

  if (!Publisher || !Publisher.trim()) {
    errores.push("El publisher es obligatorio");
  }
  if (!Category || !Category.trim()) {
    errores.push("La categoría es obligatoria");
  }
  if (Publisher && Publisher.length > 60) {
    errores.push("El publisher no debe superar 60 caracteres");
  }
  if (Category && Category.length > 2) {
    errores.push("La categoría no debe superar 2 caracteres");
  }
  if (Description && Description.length > 200) {
    errores.push("La descripción no debe superar 200 caracteres");
  }
  if (Year && Year.toString().length > 4) {
    errores.push("El año no debe superar 4 caracteres");
  }
  return errores;
}

// GET /boardgame
function listar(req, res) {
  if (connection) {
    /* Para saber si un boardgame es favorito o no, se usa una subconsulta con EXISTS. 
    Si existe una fila en la tabla favorites con el IdBoardgame correspondiente, se marca como favorito (1),
    de lo contrario no lo es (0).
    */
    let sql = `
      SELECT 
        b.ID,
        b.Name,
        b.Publisher,
        b.Category,
        b.Description,
        b.Year,
        CASE WHEN EXISTS (SELECT 1 FROM Favorites f WHERE f.IdBoardgame = b.ID) THEN 1 ELSE 0
        END AS isFavorite
      FROM Boardgames b
    `;

    connection.query(sql, (err, boardgames) => {
      if (err) {
        res.json(err);
      } else {
        console.log(boardgames);
        res.json(boardgames);
      }
    });
  }
}

// GET /boardgame/:id
function obtenerBoardgame(req, res) {
  if (connection) {
    const { id } = req.params;
    let sql = `
      SELECT 
        b.ID,
        b.Name,
        b.Publisher,
        b.Category,
        b.Description,
        b.Year,
        CASE 
          WHEN EXISTS (SELECT 1 FROM Favorites f WHERE f.IdBoardgame = b.ID) THEN 1 ELSE 0
        END AS isFavorite
      FROM Boardgames b
      WHERE b.ID = ${connection.escape(id)}
    `;

    connection.query(sql, (err, boardgame) => {
      if (err) {
        res.json(err);
      } else {
        let mensaje = "";
        if (boardgame === undefined || boardgame.length === 0) {
          mensaje = "Boardgame no encontrado";
        }
        res.json({ data: boardgame, mensaje: mensaje });
      }
    });
  }
}

// POST /boardgame 
function crear(req, res) {
  if (connection) {
    const boardgame = req.body;
    /* Aplicamos las validaciones de arriba */
    const errores = validarCamposCrear(boardgame);
    if (errores.length > 0) {
      return res.status(400).json({
        error: true,
        mensaje: "Errores de validación",
        detalles: errores
      });
    }

    let sql = 'INSERT INTO Boardgames SET ?';
    connection.query(sql, [boardgame], (err, rows) => {
      if (err) {
        res.json(err);
      } else {
        res.json({error: false, data: rows, mensaje: "Boardgame creado con éxito"});
      }
    });
  }
}

// PUT /boardgame/:id 
function editar(req, res) {
  if (connection) {
    const { id } = req.params;
    /* Solo se pueden editar publisher, category, description y year */
    const { Publisher, Category, Description, Year } = req.body;
    const datosActualizar = {Publisher, Category, Description, Year};

    /* Aplicamos las validaciones de arriba */
    const errores = validarCamposEditar(datosActualizar);
    if (errores.length > 0) {
      return res.status(400).json({
        error: true,
        mensaje: "Errores de validación",
        detalles: errores
      });
    }

    let sql = 'UPDATE Boardgames SET ? WHERE ID = ?';
    connection.query(sql, [datosActualizar, id], (err, rows) => {
      if (err) {
        res.json(err);
      } else {
        let mensaje = "";
        if (rows.changedRows === 0) {
          mensaje = "Sin cambios o Boardgame no encontrado";
        } else {
          mensaje = "Boardgame modificado con éxito";
        }
        res.json({error: false, data: rows, mensaje: mensaje});
      }
    });
  }
}

// DELETE /boardgame/:id
function eliminar(req, res) {
  if (connection) {
    const { id } = req.params;
    /* Eliminar primero las referencias en la tabla Favorites */
    let sqlDeleteFavs = 'DELETE FROM Favorites WHERE IdBoardgame = ?';
    connection.query(sqlDeleteFavs, [id], (err, result) => {
      if (err) {
        // Si falla al borrar favoritos, detenemos y enviamos error
        return res.status(500).json(err);
      }
      /* Ahora que está "limpio", eliminamos el Boardgame */
      let sqlDeleteGame = 'DELETE FROM Boardgames WHERE ID = ?';
      connection.query(sqlDeleteGame, [id], (err, rows) => {
        if (err) {
          res.status(500).json(err);
        } else {
          let mensaje = "";
          if (rows.affectedRows === 0) {
            mensaje = "No se encontró el Boardgame para eliminar";
          } else {
            mensaje = "Boardgame eliminado con éxito (y quitado de favoritos)";
          }
          res.json({
            error: false, 
            data: rows, 
            mensaje: mensaje
          });
        }
      });
    });
  }
}

module.exports = {
  listar,
  obtenerBoardgame,
  crear,
  editar,
  eliminar
};
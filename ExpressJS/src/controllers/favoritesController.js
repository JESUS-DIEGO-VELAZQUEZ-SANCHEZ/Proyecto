// Importar conexión de la BD
const connection = require('../config/connection');

// GET /favorites
function listar(req, res) {
  if (connection) {
    /* Seleccionamos los campos requeridos en la consulta con JOIN */
    let sql = `
      SELECT 
        f.ID,
        f.IdBoardgame,
        b.Name,
        b.Publisher,
        b.Category,
        b.Year
      FROM Favorites f
      INNER JOIN Boardgames b ON f.IdBoardgame = b.ID
    `;

    connection.query(sql, (err, favorites) => {
      if (err) {
        res.json(err);
      } else {
        console.log(favorites);
        res.json(favorites);
      }
    });
  }
}

// POST /favorites 
function crear(req, res) {
  if (connection) {
    const { IdBoardgame } = req.body;

    if (!IdBoardgame) {
      return res.status(400).json({
        error: true,
        mensaje: "El IdBoardgame es obligatorio para agregar a favoritos"
      });
    }

    // 1. Verificar que el juego exista
    let sqlCheck = 'SELECT * FROM Boardgames WHERE ID = ?';
    connection.query(sqlCheck, [IdBoardgame], (err, rows) => {
      if (err) {
        return res.json(err);
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          error: true,
          mensaje: "El Juego de mesa no existe, no se puede agregar a favoritos"
        });
      }

      // 2. Verificar que NO esté ya en favorites
      let sqlCheckFav = 'SELECT * FROM Favorites WHERE IdBoardgame = ?';
      connection.query(sqlCheckFav, [IdBoardgame], (err, favRows) => {
        if (err) {
          return res.json(err);
        }

        if (favRows.length > 0) {
          return res.status(400).json({
            error: true,
            mensaje: "El Juego de mesa ya está en favoritos"
          });
        }

        // 3. Insertar en favorites
        const favorito = { IdBoardgame};
        let sqlInsert = 'INSERT INTO Favorites SET ?';
        connection.query(sqlInsert, [favorito], (err, rows) => {
          if (err) {
            return res.json(err);
          } else {
            return res.json({
              error: false,
              data: rows,
              mensaje: "Juego de mesa agregado a favoritos con éxito"
            });
          }
        });
      });
    });
  }
}


// DELETE /favorites/:id
function eliminar(req, res) {
  if (connection) {
    const { id } = req.params; 
    let sql = 'DELETE FROM Favorites WHERE ID = ?';
    connection.query(sql, [id], (err, rows) => {
      if (err) {
        res.json(err);
      } else {
        let mensaje = "";
        if (rows.affectedRows === 0) {
          mensaje = "El Juego de mesa no estaba en favoritos o no existe";
        } else {
          mensaje = "Juego de mesa eliminado de favoritos con éxito";
        }
        res.json({error: false,data: rows,mensaje
        });
      }
    });
  }
}

module.exports = {
  listar,
  crear,
  eliminar
};

// Importar conexión de la BD
const connection = require ('../config/connection');

function listar(req, res){
    if(connection){
        let sql = 'select * from personas';
        connection.query(sql, (err, personas) => {
            if(err){
                res.json(err);
            } else {
                console.log(personas);
                res.json(personas);
            }
        })
    }
}

function obtenerPersona(req, res){
    if(connection){
    const { id } = req.params;
    let sql = `select * from personas where id = ${connection.escape(id)}`;
    connection.query(sql, (err, persona) => {
        if (err){
        res.json(err);
        }else{
            let mensaje = "";
            if (persona == undefined || persona.lenght === 0)
                mensaje = "Persona no encontrada";
            
                res.json({data: persona, mensaje: mensaje});
        }
    });
    }
}

function crear(req, res){
    if(connection){
        const persona = req.body;
        if(!persona.nombre){
            return res.status(400).send({error: true, mensaje: "El nombre es obligatorio"});
        }

        let sql = 'INSERT INTO personas SET ?';
        connection.query (sql, [persona], (err, rows) => {
            if (err){
                res.json(err);
            } else{
                res.json({error: false, data: rows, mensaje: "Persona creada con éxito"})
            }
        })
    }
}

function editar(req, res) {
    if(connection){
        const { id } = req.params;
        const persona = req.body;
        let sql = 'UPDATE persona SET ? WHERE id = ?';
        connection.query (sql, [persona, id], (err, row) => {
            if (err){
                res.json(error);
            }else{
                if(rows.changeRows === 0){
                    mensaje = "Sin cambios "
                }else{
                    mensaje= "Persona modificada con éxtio"
                }
                res.json({error: false, data: rows, mensaje: mensaje});
            }
        })
    }
}

function eliminar (req, res){
    if (connection){
        const {id} = req.params;
        let sql = 'delete from personas where id = ?';
        connection.query(sql, [id], (err, rows) =>{
            if (err){

            }else{
                if(rows.affectedRows === 0){
                    mensaje = "No se encontró a la persona "
                }else{
                    mensaje= "Persona eliminada con éxtio"
                }
                res.json({error: false, data: rows, mensaje: mensaje});
            }
        })
    }
}

module.exports = {
listar,
crear,
obtenerPersona,
editar,
eliminar

}
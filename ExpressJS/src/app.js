const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use (express.json());
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 3000

app.set('port', port);

// Rutas
app.get('/', (req, res) => {
    res.send("Hola");
});

// Levantar el servidor
app.listen(app.get('port'), (error) => {
    if(error){
        console.log(error);
    } else {
        console.log(`Servidor en puerto: ${port}`);
    }
});
module.exports = app;
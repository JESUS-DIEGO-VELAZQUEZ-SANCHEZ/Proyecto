const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Rutas
const boardgamesRoutes = require('./routes/boardgamesRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

/* Middleware de rutas */
app.use('/boardgame', boardgamesRoutes);
app.use('/favorites', favoritesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

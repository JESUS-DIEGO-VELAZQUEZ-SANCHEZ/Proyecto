const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// GET /favorites
router.get('/', favoritesController.listar);

// POST /favorites
router.post('/', favoritesController.crear);

// DELETE /favorites/:id  (id = idBoardgame)
router.delete('/:id', favoritesController.eliminar);

module.exports = router;

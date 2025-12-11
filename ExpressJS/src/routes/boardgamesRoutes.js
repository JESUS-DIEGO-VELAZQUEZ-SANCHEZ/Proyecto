const express = require('express');
const router = express.Router();
const boardgamesController = require('../controllers/boardgamesController');

// GET /boardgame
router.get('/', boardgamesController.listar);

// GET /boardgame/:id
router.get('/:id', boardgamesController.obtenerBoardgame);

// POST /boardgame
router.post('/', boardgamesController.crear);

// PUT /boardgame/:id
router.put('/:id', boardgamesController.editar);

// DELETE /boardgame/:id
router.delete('/:id', boardgamesController.eliminar);

module.exports = router;

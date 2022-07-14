const { Router } = require('express');
const { check } = require('express-validator');

const { buscar } = require('../controllers/buscar.controller');

// Inicializacion
const router = Router();

// Rutas
router.get('/:coleccion/:termino', [

], buscar);






module.exports = router;
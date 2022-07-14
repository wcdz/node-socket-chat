const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');

const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarJWT, validarArchivoSubir } = require('./../middlewares');

// Inicializacion
const router = Router();

// Rutas
router.post('/', [
    validarJWT,
    validarArchivoSubir
], cargarArchivos);

router.put('/:coleccion/:id', [
    validarJWT,
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;
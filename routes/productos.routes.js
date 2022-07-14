const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('./../middlewares');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { getProductos, getProducto, postProducto, putProducto, deleteProducto } = require('../controllers/productos.controller');


// Inicializacion
const router = Router();

// Rutas
router.get('/', getProductos);

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], postProducto);

// optional()
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido de producto').isMongoId(),
    check('categoria', 'No es un id valido de categoria').optional().isMongoId(),
    check('categoria').optional().custom(existeCategoriaPorId),
    check('id').custom(existeProductoPorId),
    validarCampos
], putProducto);


router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteProducto);


module.exports = router;

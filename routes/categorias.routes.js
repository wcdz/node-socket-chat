const { Router } = require('express');
const { check } = require('express-validator');

const { getCategorias, getCategoria, postCategoria, putCategoria, deleteCategoria } = require('../controllers/categorias.controller');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


// Inicializacion
const router = Router();

// Rutas
// Obtener todas las categorias - publico
router.get('/', getCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],
    getCategoria);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],
    postCategoria
);

// Actualizar - privado - cualquiera con token valido 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos],
    putCategoria); // 

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos, // -> lanza el error por check si se instancia en segmentos
    check('id').custom(existeCategoriaPorId),
    validarCampos
],
    deleteCategoria);

module.exports = router;

// En las rutas que se requiere el id tenemos que hacer una validacion perznoalizada, crear un middleware personalizado
// check('id').custom(existeCategoria)
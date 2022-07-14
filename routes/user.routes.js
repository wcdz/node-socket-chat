const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('./../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('./../middlewares'); // Node busca el index de middleware

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { userGet, userPost, userPut, userDelete, userPatch } = require('../controllers/user.controller');

// Inicializacion
const router = Router();


// REST endpoints -> URL
router.get('/', userGet); // Mandamos la referencia, no la ejecucion ! ()

// check -> registra errores para mostrarlo en el controller
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // isEmpty() esta vacio + not() -> no esta vacio
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROL', 'USER_ROL']),
    check('rol').custom(esRoleValido), // (rol = '') => esRoleValido(rol) -> hacemos referencia
    validarCampos // No continua a la ruta si hay algun errror en los check
], userPost); // 2do argumento -> middleware, 3er argumento -> controlador

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], userPut); // :id -> parametros de segmento

router.delete('/:id', [
    validarJWT,
    // esAdminRole, // Especificamente tiene que ser admin
    tieneRole('ADMIN_ROL', 'VENTAS_ROL'), // Puede ser de todos estos roles
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], userDelete);

router.patch('/', userPatch);



module.exports = router;
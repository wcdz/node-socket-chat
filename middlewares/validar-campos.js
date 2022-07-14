const { validationResult } = require('express-validator');


const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    // Si hay errores -> lanzalos
    if (!errors.isEmpty()) return res.status(400).json(errors); // -> Postman 
    next(); // Si llega a este punto sigue con el siguiente middleware o por defecto el controlador
}


module.exports = {
    validarCampos
}
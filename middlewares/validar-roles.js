const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    // Si el objeto es vacio return -> validar-jwt.js
    if (!req.user) return res.status(500).json({ msg: 'Se quiere verificar el rol sin validar el token primero' });

    const { rol, nombre } = req.user;

    if (rol !== 'ADMIN_ROL') return res.status(401).json({ msg: `${nombre} no es administrador -> No puede realizar esta acción` })

    next();
}

// operador rest ... cuando es argumento, spreed op cuando es para referenciar
const tieneRole = (...roles) => {
    return (req, res = response, next) => {

        if (!req.user) return res.status(500).json({ msg: 'Se quiere verificar el rol sin validar el token primero' });

        if (!roles.includes(req.user.rol)) return res.status(401).json({ msg: `El servicio requiere uno de estos roles ${roles}` });

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}







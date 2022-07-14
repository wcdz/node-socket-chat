const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('./../models/user.js');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) return res.status(401).json({
        msg: 'No hay token en la peticion'
    });

    try {

        // Verificamos el token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);


        // Leer el usuario que corresponde al uid
        const userQueElimina = await User.findById(uid);
        // req.uid = uid;

        // Verificar que el id no se retorne undefined 
        if(!userQueElimina) return res.status(401).json({msg:'Token no valido -> usuario no existe en DB'});

        // Verificar si el uid tiene estado true
        if (!userQueElimina.estado) return res.status(401).json({msg:'Token no valido -> usuario con estado: false'});

        req.user = userQueElimina;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}



module.exports = {
    validarJWT
}
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('./../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ correo });
        if (!user) return res.status(400).json({ msg: 'Usuario / Password no son correctos -> correo' });

        // Si el usuario esta activo 
        if (!user.estado) return res.status(400).json({ msg: 'Usuario / Password no son correctos -> estado: false' });

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) return res.status(400).json({ msg: 'Usuario / Password no son correctos -> password' });


        // Generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            msg: "Login ok",
            user,
            token
        });

    } catch (error) {
        console.log(error); // Internal server error
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}



const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let user = await User.findOne({ correo });

        // Esto es para verificar que no exista el usuario
        if (!user) { // Si no hay objeto
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            user = new User(data);

            await user.save();
        }

        // Si el usuario en DB
        if (!user.estado) return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });

        // Generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            msg: 'Login ok - Google SignIn',
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}

const renovarToken = async (req, res = response) => {

    const { user } = req;

    // Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
        user,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}
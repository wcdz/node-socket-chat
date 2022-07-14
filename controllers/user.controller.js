const { response, request } = require('express'); // No es necesario hacerlo pero sirve como objeto para obtener parametros, o tipado
const bcryptjs = require('bcryptjs');

const User = require('./../models/user.js');

const userGet = async (req = request, res = response) => {

    // -> ?q=hola&nombre=will&apikey=1234567890
    // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query; // -> ?

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }; // Solo me devuelves los registros que estan activos

    // const users = await User.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await User.countDocuments(query); // Retorna el numero de registros de la coleccion

    // De esta forma se ejecutan ambos procedimientos simultaneamente con un "await" unico , mas rapido | resp
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        users
    });
}

const userPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body; // Excluir solo google -> {google, ...data} -> data es lo mismo que la desestructuracion actual
    const user = new User({ nombre, correo, password, rol }); // Creamos la instancia en mongodb

    // Encriptar contraseña -> hash
    const salt = bcryptjs.genSaltSync(10); // Valor para las vueltas que se le da a la encriptacion de la contraseña
    user.password = bcryptjs.hashSync(password, salt); // Listo se encripto

    // Guardar en DB
    await user.save(); // ! Falta manejar errores

    res.status(201).json(user);

}

const userPut = async (req = request, res = response) => {

    const { id } = req.params; // -> req.params.id
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: validar contra la base de datos
    if (password) {
        // Encriptar contraseña -> hash
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto); // Buscalo por el id y actualizalos -> retorna los datos actualizados del objeto

    res.status(400).json(user);
}

const userDelete = async (req = request, res = response) => {

    const { id } = req.params;

    // const uid = req.uid; // Recuperado del middleware validar-jwt -> del user autenticado que borra -> primero te autenticas -> {user,uid}

    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete(id);

    // Cambiamos su estado de true a false
    const user = await User.findByIdAndUpdate(id, { estado: false });
    // const userAutenticado 
    // const userAutenticado = req.user; -> para saber cual es el que elimina

    res.json(user);
}

const userPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controller',
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}
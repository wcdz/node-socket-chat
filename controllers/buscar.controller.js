const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'productos-por-categorias',
    'roles',
    'users'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True

    if (esMongoID) {
        const user = await User.find({ _id: termino, estado: true }); // findById(termino) -> asi era
        return res.json({
            results: (user) ? [user] : [] // Si existe el usuario
        });
    }

    const regex = new RegExp(termino, 'i'); // bandera i - es indiferente - ignoreCase

    // Busca con nombre o correo - retorna los activos
    const users = await User.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    }); // El find devuelve un arreglo

    res.json({
        results: users
    });

}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.find({ _id: termino, estado: true });
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    // Busca con nombre 
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.find({ _id: termino, estado: true })
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    // Busca con nombre 
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}

const buscarProductosPorCategorias = async (termino = '', res) => {
    try {

        const esMongoID = ObjectId.isValid(termino); // Esto es de la categoria

        if (esMongoID) {
            const producto = await Producto.find({ categoria: termino, estado: true })
                .populate('categoria', 'nombre'); // Retornamos el objeto productos con su populate categoria
            return res.json({
                results: (producto) ? [producto] : []
            });
        }

        const regex = new RegExp(termino, 'i');

        // Buscamos las categorias para validar el nombre
        const categorias = await Categoria.find({ nombre: regex, estado: true });

        if (!categorias.length) return res.status(400).json({ msg: `No hay resultados para ${termino}` });

        // Busqueda de productos
        const productos = await Producto.find({
            $or: [...categorias.map((categoria) => ({
                categoria: categoria._id
            }))], // Buscamos todos los productos que coincidan con todas los id de las categorias
            $and: [{ estado: true }]
        }).populate('categoria', 'nombre'); // hacemos match con categoria

        res.json({
            results: productos
        });

    } catch (error) {
        res.status(400).json(error);
    }
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) return res.status(400).json({ msg: `Las colecciones permitidas son: ${coleccionesPermitidas}` });

    switch (coleccion) {
        case 'users':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'productos-por-categorias':
            buscarProductosPorCategorias(termino, res);
            break;
        // case 'roles':
        // break;
        default:
            res.status(500).json({ msg: 'Se me olvido hacer esta busqueda' });
    }

}


module.exports = {
    buscar
}
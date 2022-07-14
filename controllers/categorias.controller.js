const { response, request } = require('express');

const { Categoria } = require('./../models');

// getCategorias - paginado - total - populate -> relacion del usuario (obtiene los valores del usuarios)
const getCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query; // paginado
    const query = { estado: true }; // Solo retornas los que no fueron borrados

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('user', 'nombre') // Este es el obj user que inserto la categoria - moongose - funciona con la propiedad existente en la coleccion - el 2do parametro es la propiedad del objeto
    ]);

    // Retorno del objeto con la cantidad total de categorias activas y los objetos categorias
    res.json({
        total,
        categorias
    });
}


// getCategoria - populate - {}
const getCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('user', 'nombre');

    res.json(categoria);
}

// postCategoria
const postCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); // Lo quiero en mayusculas

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) return res.status(400).json({
        msg: `La categoria ${categoriaDB.nombre} ya existe en la DB`
    });

    // Generar la data a guardar
    const data = {
        nombre,
        user: req.user._id
    }

    // Preparamos el objeto
    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// ! VERIFICAR MAS A DELANTE
// putCategoria - cambiar nombre y el nombre no debe de existir
const putCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, user, ...data } = req.body

    data.nombre = data.nombre.toUpperCase(); // Se guarda en mayus
    data.user = req.user._id; // Ultimo en hacer la modificacion

    const categoria = await Categoria.findByIdAndUpdate(id, data,
        { new: true }); // {new: true} -> se muestra la respuesta actualizada en el Client API

    res.status(400).json(categoria);
}

// deleteCategoria - estado:false -> verificar id
const deleteCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json(categoriaBorrada);

}

module.exports = {
    getCategorias,
    getCategoria,
    postCategoria,
    putCategoria,
    deleteCategoria
} 
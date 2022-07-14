const { response, request } = require('express');

const { Producto } = require('./../models');



const getProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('user', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    })
}

const getProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id).populate('user', 'nombre').populate('categoria', 'nombre');

    res.json(producto);
}

const postProducto = async (req = request, res = response) => {

    const { estado, user, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if (productoDB) return res.status(400).json({ msg: `El producto ${productoDB.nombre}, ya existe` });


    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        user: req.user._id
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

const putProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, user, ...data } = req.body

    if (data.nombre) data.nombre = data.nombre.toUpperCase(); // Si me lo envia lo capitalizamos
    data.user = req.user._id; // Ultimo en hacer la modificacion

    const producto = await Producto.findByIdAndUpdate(id, data,
        { new: true });

    res.status(400).json(producto);

}

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json(productoBorrado);

}


module.exports = {
    getProductos,
    getProducto,
    postProducto,
    putProducto,
    deleteProducto
}
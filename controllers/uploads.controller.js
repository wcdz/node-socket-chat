const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");

const { subirArchivo } = require('./../helpers');

const { User, Producto } = require('./../models');

// express-fileupload -> para subir archivos
const cargarArchivos = async (req = request, res = response) => {

    // Esta validacion ahora es un middleware -> funciona en routes
    // if (!req.files || !req.files.archivo || Object.keys(req.files).length === 0) return res.status(400).json({ msg: 'No hay archivos que subir' });

    try {

        // txt, md
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        // Imagenes
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });

    } catch (error) {
        res.status(400).json({ msg: error });
    }

}

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id)
            if (!modelo) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre; // Path en donde se encuentra la imagen

    await modelo.save();

    res.json({ modelo });

}


const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id)
            if (!modelo) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id); // No necesita await porque es un proceso aparte en la nube
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url; // Path en donde se encuentra la imagen

    await modelo.save();

    res.json(modelo);

}


const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id)
            if (!modelo) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen); // Esto cambia
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);

}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
const { response, request } = require("express")

const validarArchivoSubir = (req = request, res = response, next) => {
    if (!req.files || !req.files.archivo || Object.keys(req.files).length === 0) return res.status(400).json({ msg: 'No hay archivos que subir - archivo' });

    next();
}

module.exports = {
    validarArchivoSubir
}
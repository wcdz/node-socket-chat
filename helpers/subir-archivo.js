const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.'); // Para obtener la extension del archivo
        //console.log(nombreCortado);

        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) return reject(`La extension ${extension} no es permitida en este servidor, ${extensionesValidas}`);

        const nombreTemp = uuidv4() + `.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) return reject(err);

            resolve(nombreTemp);
        });
    });
}


module.exports = {
    subirArchivo
}

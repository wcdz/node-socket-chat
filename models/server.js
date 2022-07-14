const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
require('dotenv').config();


const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socket.controller');

class Server {

    // Constructor por defecto
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app); // Este sera el servidor escuchado
        this.io = require('socket.io')(this.server); // para el servidor socket

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            user: '/api/user',
            uploads: '/api/uploads'
        }

        // Conectar a base de datos
        this.connectDB();

        // Middlewares -> Intermediarios en el server y el router/controller
        this.middlewares();

        // Rutas
        this.routes();

        // Sockets
        this.sockets();
    }

    // Metodos
    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico -> Express consume los documentos html de este directorio
        this.app.use(express.static('public'));

        // FileUpload -> Carga de archivos - express-fileupload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }


    routes() {
        // Middleware condicionado
        this.app.use(this.paths.auth, require('./../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('./../routes/buscar.routes'));
        this.app.use(this.paths.categorias, require('./../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('./../routes/productos.routes'));
        this.app.use(this.paths.user, require('./../routes/user.routes'));
        this.app.use(this.paths.uploads, require('./../routes/uploads.routes'));
    }

    // Configuracion para escuchar los sockets
    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`RestServer -> ok :: port: ${this.port}`.blue);
        });
    }

}






module.exports = Server;

// Cors -> protege el servidor y los endpoints, muchos navegadores web dan errores si no lo tenemos configurado
// Postman -> se salta el cors 
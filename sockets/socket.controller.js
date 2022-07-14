const { Socket } = require("socket.io"); // Importacion como referencia
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('./../models');

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
    const token = socket.handshake.headers['x-token'];
    const user = await comprobarJWT(token);

    if (!user) return socket.disconnect();

    // Agregar el usuario conectado
    chatMensajes.conectarUser(user);
    io.emit('users-activos', chatMensajes.usersArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimosDiez);

    // Conectar a una sala especial, por id del usuario
    socket.join(user.id); // Global, socket.id, user.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUser(user.id); // Eliminamos de la lista
        io.emit('users-activos', chatMensajes.usersArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if (uid) {
            // Mensaje privado
            socket.to(uid).emit('mensaje-privado', { de: user.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje(user.uid, user.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimosDiez);
        }
    });
}

module.exports = {
    socketController
}

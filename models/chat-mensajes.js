
class Mensaje {
    constructor(uid, nombre, mensaje) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.users = {};
    }

    get ultimosDiez() {
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    get usersArr() {
        return Object.values(this.users); // [{}, {}, {}]
    }

    enviarMensaje(uid, nombre, mensaje) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUser(user) {
        this.users[user.id] = user;
    }

    desconectarUser(id) {
        delete this.users[id];
    }

}

module.exports = ChatMensajes;
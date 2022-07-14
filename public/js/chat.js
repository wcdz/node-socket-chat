// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsers = document.querySelector('#ulUsers');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

// Variables Globales
let user = null;
let socket = null;

const url = window.location.hostname.includes("localhost")
    ? "http://localhost:3000/api/auth/"
    : "https://willcd-node-restserver.herokuapp.com/api/auth/";

// Validar el token del localsotrage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.nombre; // Redireccion

    await conectarSocket();
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes); // Como referencia dibujarMensajes(payload)

    socket.on('users-activos', dibujarUsers);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado: ', payload);
    });
}

const dibujarUsers = (users = []) => {

    let usersHtml = ``;
    users.forEach(({ nombre, uid }) => {
        usersHtml += `
        <li>
            <p>
                <h5 class ="text-success">${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `;
    });

    ulUsers.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {

    let mensajesHtml = ``;
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
        <li>
            <p>
                <span class ="text-primary">${nombre}</span>
                <span>${mensaje}</span>
            </p>
        </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}


txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) return;
    if (mensaje.length === 0) return;

    socket.emit('enviar-mensaje', ({ mensaje, uid }));

});


const main = async () => {
    await validarJWT();
}

main();

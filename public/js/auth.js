// Referencias HTML
const miFormulario = document.querySelector('form');

// Definicion del URL
const url = window.location.hostname.includes("localhost")
    ? "http://localhost:3000/api/auth/"
    : "https://willcd-node-restserver.herokuapp.com/api/auth/";

// Enviaremos un post al backend, por lo que se me retornara un objeto
// La autenticacion sera manual
miFormulario.addEventListener('submit', (ev) => { // Evento -> ev
    ev.preventDefault();

    const formData = {}; // Datos para enviar al backend

    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then((resp) => resp.json())
        .then(({ msg, token }) => {
            if (msg) console.error(msg);
            if (token === undefined) return console.error('Verifique los campos');
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => { console.log(err); });
});


// La autenticacion sera dada por google
function handleCredentialResponse(response) {
    // Google token : ID_TOKEN
    // console.log("id_token", response.credential);

    const body = { id_token: response.credential };

    // ring a Bell Stream -> fetch por defecto es get
    fetch(url + 'google', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then(({ token }) => {
            // console.log(token);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => { console.log(err) });
}

const button = document.getElementById("google_signout");
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    // Se elimina el token del local storage y se elimina la sesion de google y se recarga la pagina
    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload();
    });
};
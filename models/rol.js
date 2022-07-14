const { Schema, model } = require('mongoose');


const RolSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});



module.exports = model('Role', RolSchema); // Role not Rol -> genera problemas al tener como valor rol
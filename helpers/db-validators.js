const { Categoria, Role, User, Producto } = require('../models');
// const Role = require('./../models/rol.js');
// const User = require('./../models/user.js');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) throw new Error(`El rol ${rol} no esta registrado en la DB`);
}

const emailExiste = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });
    if (existeEmail) throw new Error(`El correo: ${correo} ya esta registrado`);
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario) throw new Error(`El id ${id} no existe`);
}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) throw new Error(`El id ${id} categoria no existe`);
}

const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) throw new Error(`El id ${id} producto no existe`);
}

const coleccionesPermitidas = async (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}
'use strict'

//IMPORTACIONES
const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');

//RUTAS
var api = express.Router();
api.post('/login', usuarioControlador.login);
api.post('/registrarCliente', usuarioControlador.registrarCliente);
api.post('/registrarAdmin', md_autenticacion.ensureAuth, usuarioControlador.registrarAdmin);
api.put('/editarRol/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarRol);
api.put('/editarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.put('/editarUsuarioCliente/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuarioCliente);
api.delete('/eliminarCuentaCliente/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarCuentaCliente)

module.exports = api;
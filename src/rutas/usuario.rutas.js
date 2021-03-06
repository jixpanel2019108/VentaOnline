'use strict'

//IMPORTACIONES
const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');

//RUTAS
var api = express.Router();
api.post('/login', usuarioControlador.login);
api.post('/registrarCliente', usuarioControlador.registrarCliente)
api.post('/registrarAdmin', md_autenticacion.ensureAuth, usuarioControlador.registrarAdmin);
api.put('/editarRol/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarRol)

module.exports = api;
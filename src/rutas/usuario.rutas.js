'use strict'

//IMPORTACIONES
const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');

//RUTAS
var api = express.Router();
api.post('/login', usuarioControlador.login);

module.exports = api;
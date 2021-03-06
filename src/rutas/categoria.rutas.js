'use strict'
const express = require('express');
const categoriaControlador = require('../controladores/categoria.controlador')

var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();


module.exports = api;
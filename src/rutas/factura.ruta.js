'use strict'
const express = require('express');
const facturaControlador = require('../controladores/factura.controlador')

const md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/generarFactura', md_autenticacion.ensureAuth, facturaControlador.generarFactura)

module.exports = api;
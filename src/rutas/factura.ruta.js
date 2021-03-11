'use strict'
const express = require('express');
const facturaControlador = require('../controladores/factura.controlador')

const md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/generarFactura', md_autenticacion.ensureAuth, facturaControlador.generarFactura);
api.get('/obtenerProductosFactura/:idFactura', md_autenticacion.ensureAuth, facturaControlador.obtenerProductosFactura);
api.get('/obtenerFacturasUsuarios',md_autenticacion.ensureAuth,facturaControlador.obtenerFacturasUsuarios);;
api.get('/obtenerMisFacturas',md_autenticacion.ensureAuth, facturaControlador.obtenerMisFacturas);

module.exports = api;
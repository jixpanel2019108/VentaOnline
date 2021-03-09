'use strict'
const express = require('express')
const carritoControlador = require('../controladores/carrito.controlador');
const md_autenticacion = require('../middlewares/authenticated');

const api = express.Router();
api.put('/llevarProductoCarrito/:idProducto', md_autenticacion.ensureAuth, carritoControlador.llevarProductoCarrito);

module.exports = api;
'use strict'
const express = require('express');
const productoControlador = require('../controladores/producto.controlador');

const md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarProducto/:idCategoria', md_autenticacion.ensureAuth, productoControlador.registrarProducto);
api.get('/obtenerProductoId/:idProducto', md_autenticacion.ensureAuth, productoControlador.obtenerProductoId);
api.get('/obtenerProductos', md_autenticacion.ensureAuth, productoControlador.obtenerProductos);
api.put('/editarProducto/:idProducto', md_autenticacion.ensureAuth, productoControlador.editarProducto);


module.exports = api;
'use strict'
const express = require('express');
const productoControlador = require('../controladores/producto.controlador');

const md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarProducto/:idCategoria', md_autenticacion.ensureAuth, productoControlador.registrarProducto);
api.get('/obtenerProductoId/:idProducto', md_autenticacion.ensureAuth, productoControlador.obtenerProductoId);
api.get('/obtenerProductos', md_autenticacion.ensureAuth, productoControlador.obtenerProductos);
api.put('/editarProducto/:idProducto', md_autenticacion.ensureAuth, productoControlador.editarProducto);
api.get('/obtenerProductoNombre', md_autenticacion.ensureAuth, productoControlador.obtenerProductoNombre);
api.get('/obtenerProductoIdCategoria/:idCategoria',md_autenticacion.ensureAuth,productoControlador.obtenerProductoIdCategoria);
api.get('/productosMasVendidos', md_autenticacion.ensureAuth, productoControlador.productosMasVendidos)


module.exports = api;
'use strict'
const express = require('express');
const categoriaControlador = require('../controladores/categoria.controlador')

var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/agregarCategoria', md_autenticacion.ensureAuth, categoriaControlador.agregarCategoria);
api.get('/obtenerCategoria', md_autenticacion.ensureAuth, categoriaControlador.obtenerCategoria);
api.put('/editarCategoria/:idCategoria', md_autenticacion.ensureAuth, categoriaControlador.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', md_autenticacion.ensureAuth, categoriaControlador.eliminarCategoria);


module.exports = api;
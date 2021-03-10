'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const usuario_ruta = require("./src/rutas/usuario.rutas");
const categoria_ruta = require("./src/rutas/categoria.rutas");
const producto_ruta = require('./src/rutas/producto.rutas');
const carrito_ruta = require("./src/rutas/carrito.rutas");
const factura_ruta = require("./src/rutas/factura.ruta")

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(cors());

app.use('/api', usuario_ruta, categoria_ruta, producto_ruta, carrito_ruta, factura_ruta);

module.exports = app;
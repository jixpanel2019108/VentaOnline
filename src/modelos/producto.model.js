'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductoSchema = Schema({
    producto: String,
    cantidad: Number,
    precio: Number,
    cantidadVendida: Number,
    categoria:{type: Schema.Types.ObjectId,ref:'categorias'}
})

module.exports = mongoose.model('productos', ProductoSchema);
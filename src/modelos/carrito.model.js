'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    listaProductos:[{
        cantidad: Number,
        precio: Number,
        subTotal: Number,
        idProducto: {type: Schema.ObjectId, ref: 'productos'}
    }],
    usuarioCarrito:{type: Schema.Types.ObjectId, ref:'usuarios'},
    total: Number
})

module.exports = mongoose.model('carritos', CarritoSchema);
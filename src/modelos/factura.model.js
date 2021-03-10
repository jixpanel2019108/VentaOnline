'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    listaProductos:[{
        cantidad: Number,
        subTotal: Number,
        idProducto: {type: Schema.ObjectId, ref: 'productos'}
    }],
    usuarioCarrito:{type: Schema.Types.ObjectId, ref:'usuarios'},
    total: Number
})

module.exports = mongoose.model('facturas',FacturaSchema)
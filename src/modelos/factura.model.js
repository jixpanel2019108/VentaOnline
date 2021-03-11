'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    listaProductos:[{
        cantidad: Number,
        subTotal: Number,
        idProducto: {type: Schema.ObjectId, ref: 'productos'}
    }],
    usuarioFactura:{type: Schema.Types.ObjectId, ref:'usuarios'},
    total: Number
})

module.exports = mongoose.model('facturas',FacturaSchema)
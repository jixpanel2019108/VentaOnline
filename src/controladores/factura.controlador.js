'use strict'
const Factura = require('../modelos/factura.model');
const Carrito = require('../modelos/carrito.model');
const Producto = require('../modelos/producto.model')

function generarFactura(req,res){
    var facturaModel = new Factura();
    var productoModel = new Producto();

    Carrito.findOne({usuarioCarrito: req.user.sub},(err, carritoEncontrado) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!carritoEncontrado) return res.status(500).send({mensaje:'Error al obtener datos'})
        facturaModel.listaProductos = carritoEncontrado.listaProductos;
        facturaModel.usuarioFactura = carritoEncontrado.usuarioCarrito;
        facturaModel.total = carritoEncontrado.total;
        
        facturaModel.save((err, facturaGuardada) => {
            if (err) return res.status(500).send({mensaje:'Error en la peticion de factura'});
            if (!facturaGuardada) return res.status(500).send({mensaje:'Error al guardar factura'})
            
            var carritoArray = carritoEncontrado.listaProductos;
            carritoArray.forEach(function(elemento){
                Producto.findById(elemento.idProducto,(err, productoAnterior) => {    
                    Producto.findByIdAndUpdate(elemento.idProducto,
                    {cantidad:productoAnterior.cantidad-elemento.cantidad,cantidadVendida:productoAnterior.cantidadVendida+elemento.cantidad},
                    (err, productoActualizado) =>{ console.log(productoActualizado)})
                })
            })

            return res.status(200).send(facturaGuardada)
        })
    })
}

module.exports = {
    generarFactura
}
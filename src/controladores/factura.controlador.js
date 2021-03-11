'use strict'
const Factura = require('../modelos/factura.model');
const Carrito = require('../modelos/carrito.model');
const Producto = require('../modelos/producto.model')

function generarFactura(req,res){
    var facturaModel = new Factura();
    var productoModel = new Producto();

    Carrito.findOne({usuarioCarrito: req.user.sub},(err, carritoEncontrado) => {
        if (carritoEncontrado.listaProductos.length == 0) return res.status(500).send({mensaje:'El carrito esta vacio, Compre!!!'})
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
                    {new:true, useFindAndModify: false},
                    (err, productoActualizado) =>{ console.log(productoActualizado)})
                })
            })
            Carrito.findOneAndUpdate({usuarioCarrito:req.user.sub},{$set:{listaProductos:[]},total:0},(err,carritoVacio) => {})

            return res.status(200).send(facturaGuardada)
        })
    })
}

function obtenerProductosFactura(req,res){
    var idFactura = req.params.idFactura;
    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores tienen esta funcion'});
    
    Factura.findById(idFactura,{"listaProductos.producto":1,"listaProductos.precio":1,"listaProductos.cantidad":1,"listaProductos.subTotal":1},
    (err,facturaEncontrada)=>{
        return res.status(200).send({ProductosEncontradosEnLaFactura:facturaEncontrada})
    })
}

function obtenerFacturasUsuarios(req,res){
    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores tienen esta funcion'});
    
    Factura.find({},(err, facturasEncontradas) => {
        return res.status(200).send(facturasEncontradas)
    })
}

function obtenerMisFacturas(req,res){
    if (req.user.rol != 'Cliente') return res.status(500).send({mensaje:'Solo los administradores tienen esta funcion'});
    Factura.find({usuarioFactura:req.user.sub},{"listaProductos.producto":1,"listaProductos.precio":1,"listaProductos.cantidad":1,"listaProductos.subTotal":1,total:1},
        (err,facturasEncontradas) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!facturasEncontradas) return res.status(500).send({mensaje:'Error al obtener facturas'});

        return res.status(200).send({facturasEncontradas:facturasEncontradas})
    })
}

module.exports = {
    generarFactura,
    obtenerProductosFactura,
    obtenerFacturasUsuarios,
    obtenerMisFacturas
}
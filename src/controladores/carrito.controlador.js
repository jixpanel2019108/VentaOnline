'use strict'
const Carrito = require('../modelos/carrito.model');
const productoModel = require('../modelos/producto.model');
const Producto = require('../modelos/producto.model');

function llevarProductoCarrito(req,res){
    var idProducto = req.params.idProducto;
    var idUsuario = req.user.sub;
    var params = req.body;

    if (req.user.rol != 'Cliente') return res.status(500).send({mensaje:'Solo los clientes pueden agregar al carrito de compras'})
    Producto.findById(idProducto).exec((err, productoEncontrado) =>{
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a productos'})
        if (productoEncontrado.cantidad < params.cantidad) return res.status(500).send({mensaje:`No hay productos suficientes lo maximo que puede escoger es ${productoEncontrado.cantidad}`});
        if (!productoEncontrado) return res.status(500).send({mensaje:'Error al buscar usuarios'})
        if (productoEncontrado.cantidad == 0) return res.status(500).send({mensaje:'No hay existencias'})

        var subTotalFinal = params.cantidad * productoEncontrado.precio;
        var precio = productoEncontrado.precio;

        Carrito.findOneAndUpdate({usuarioCarrito:idUsuario}, {$push:{listaProductos:{cantidad:params.cantidad, subTotal:subTotalFinal, idProducto:idProducto}}},
            {new:true, useFindAndModify: false}, (err, productoAgregado) => {

            if (err) return res.status(500).send({mensaje:'Error en la peticion'});
            if (!productoAgregado) return res.status(500).send({mensaje:'Error al ingresar los datos'});

            var idProducto = req.params.idProducto;
            var total = productoAgregado.total;
            
            var integerParam = parseInt(params.cantidad,10);

            productoModel.findByIdAndUpdate(idProducto,{cantidad:productoEncontrado.cantidad-params.cantidad,cantidadVendida:productoEncontrado.cantidadVendida+integerParam},(err, productoActualizado) =>{})
            Carrito.findOneAndUpdate({usuarioCarrito:idUsuario},{total:total+(precio*params.cantidad)},{new:true},(err,actualizado) => { return res.status(200).send({CARRITO:actualizado});})
        })
    })
}


module.exports = {
    llevarProductoCarrito
}
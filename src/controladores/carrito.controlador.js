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
        if (!productoEncontrado) return res.status(500).send({mensaje:'Error al buscar productos'})
        if (productoEncontrado.cantidad == 0) return res.status(500).send({mensaje:'No hay existencias'})

        var integerCantidad = parseInt(params.cantidad,10);
        var subTotalFinal = integerCantidad * productoEncontrado.precio;
        var precio = productoEncontrado.precio;
        precio = parseInt(precio,10);

        Carrito.findOne({usuarioCarrito:req.user.sub, "listaProductos.idProducto":idProducto},(err, productoSearch) => {
            if (err) return res.status(500).send({mensaje:'Error en el productoSearch'})
            //return console.log(productoSearch)
            if (!productoSearch){
                //SIGNIFICA QUE AUN NO EXISTE EL PRODUCTO ESE EN EL CARRITO
                Carrito.findOneAndUpdate({usuarioCarrito:idUsuario}, 
                    {$push:{listaProductos:{producto:productoEncontrado.producto,precio:productoEncontrado.precio, cantidad:integerCantidad, subTotal:subTotalFinal, idProducto:idProducto}}},
                    {new:true, useFindAndModify: false}, (err, productoAgregado) => {
                    if (err) return res.status(500).send({mensaje:'Error en la peticion'});
                    if (!productoAgregado) return res.status(500).send({mensaje:'Error al ingresar los datos'});
                    var idProducto = req.params.idProducto;
                    var total = parseInt(productoAgregado.total,10);
                    var integerParam = parseInt(params.cantidad,10);
        
                    //productoModel.findByIdAndUpdate(idProducto,{cantidad:productoEncontrado.cantidad-params.cantidad,cantidadVendida:productoEncontrado.cantidadVendida+integerParam},(err, productoActualizado) =>{})
                    Carrito.findOneAndUpdate({usuarioCarrito:req.user.sub, "listaProductos.idProducto":idProducto},{total:total+(precio*integerParam)},{new:true},(err,actualizado) => { return res.status(200).send({CARRITO:actualizado});})
                })
            }else{
            //EL PRODUCTO YA EXISTE EN EL CARRITO
                var productosArray = productoSearch.listaProductos;
                var productosObjeto = Object.assign({},productosArray);
                
                for (let indice=0; indice<productosArray.length; indice++){
                    var idLista = productosArray[indice]._id;
                    var cantidadArray = productosArray[indice].cantidad;
                    var subTotalArray = productosArray[indice].subTotal;
                    var idProductoArray = productosArray[indice].idProducto;
                    var integerParam = parseInt(params.cantidad,10);
                    var cantidadTotal = cantidadArray+integerParam;
                    console.log(""+cantidadTotal+","+productoEncontrado.cantidad)
                    if (cantidadTotal > productoEncontrado.cantidad) return res.status(500).send({mensaje:'No puede ingresar mas productos de los que hay en stock'})

                    if (req.params.idProducto == idProductoArray) {
                        productosArray.forEach(function(elemento){
                            if (elemento.idProducto == idProducto){
                                Carrito.findOneAndUpdate({usuarioCarrito:req.user.sub, "listaProductos.idProducto":idProducto},
                                {"listaProductos.$.cantidad":integerCantidad+cantidadArray,"listaProductos.$.subTotal":subTotalArray+subTotalFinal},(err, productoAgregado) =>{
                                    if (err) return res.status(500).send({mensaje:'Error en la peticion'});
                                    if (!productoAgregado) return res.status(500).send({mensaje:'Error al ingresar los datos xdxd'});
                                    var total = parseInt(productoAgregado.total,10);
                                    var integerParam = parseInt(params.cantidad,10);
                                    Carrito.findOneAndUpdate({usuarioCarrito:req.user.sub, "listaProductos.idProducto":idProducto},
                                    {total:total+(precio*integerParam)},{new:true},(err,actualizado) => { return res.status(200).send({CARRITO:actualizado});})
                                })
                            }
                        })
                    }else{
                        console.log('error')
                    }
                }     
            }
        }) 
    })
}


module.exports = {
    llevarProductoCarrito
}
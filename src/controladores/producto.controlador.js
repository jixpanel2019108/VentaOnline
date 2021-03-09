'use strict'

const Producto = require('../modelos/producto.model');

function registrarProducto(req,res){
    var params = req.body;
    var idCategoria = req.params.idCategoria;
    var productoModel = new Producto();

    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden registrar productos'});
    if (!params.producto || !params.precio) return res.status(500).send({mensaje:'Rellene los campos necesarios'});
    productoModel.producto = params.producto;
    productoModel.cantidad = params.cantidad;
    productoModel.precio = params.precio;
    productoModel.cantidadVendida = 0;
    productoModel.categoria = idCategoria;
    Producto.find({producto: productoModel.producto},(err, productoEncontrado) =>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (productoEncontrado && productoEncontrado.length >= 1) return res.status(500).send({mensaje:'El producto ya existe'});
    
        productoModel.save((err, productoGuardado) => {
            if (err) return res.status(500).send({mensaje: 'Hubo un error al guardar el producto'});
            if (!productoGuardado) return res.status(500).send({mensaje:'Error al guardar los datos'})
    
            return res.status(200).send({productoGuardado})
        })
    })
}

function obtenerProductoId(req,res){
    var idProducto = req.params.idProducto;

    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los Administradores pueden obtener los productos'});
    Producto.findById(idProducto, (err, productoEncontrado) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion de datos'});
        if (!productoEncontrado) return res.status(500).send({mensaje:'Error al obtener los datos'})

        return res.status(200).send({productoEncontrado});
    })
}

function obtenerProductos(req,res){
    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los Administradores pueden obtener los productos'})
    Producto.find({},(err, productosEncontrados) => {
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion'});
        if (!productosEncontrados) return res.status(500).send({mensaje:'Error al obtener los datos'});

        return res.status(200).send({productosEncontrados})
    })
}

function editarProducto(req,res){
    var params = req.body;
    var idProducto = req.params.idProducto;

    if(req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden editar'});
    Producto.findByIdAndUpdate(idProducto,{producto: params.producto, cantidad: params.cantidad, precio: params.precio},{new:true, useFindAndModify: false},(err, productoActualizado) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion de actualizar'})
        if (!productoActualizado) return res.status(500).send({mensaje:'Error al actualizar datos'});

        return res.status(200).send({productoActualizado})
    })
}

function obtenerProductoNombre(req,res){
    var params = req.body;

    if(req.user.rol != 'Cliente') return res.status(500).send({mensaje:'Solo los clientes tienen esta funcion'});
    Producto.findOne({producto:{$regex:params.producto,$options:'i'}},(err, productoEncontrado) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion a producto'})
        if (!productoEncontrado) return res.status(500).send({mensaje:'El producto no existe'});
        
        return res.status(200).send({productoEncontrado:productoEncontrado})
    })
}

function obtenerProductoIdCategoria(req,res){
    var params = req.body;
    var idCategoria = req.params.idCategoria

    if(req.user.rol != 'Cliente') return res.status(500).send({mensaje:'Solo los clientes tienen esta funcion'});
    Producto.find({categoria:idCategoria},(err, productosEncontrado) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion a productos'})
        if (!productosEncontrado) return res.status(500).send({mensaje:'Error al obtener datos'});
        
        return res.status(200).send({productosEncontrado:productosEncontrado})
    })
}

function productosMasVendidos(req,res){
    if (req.user.rol != 'Cliente') return res.status(500).send({mensaje:'Solo los clientes tiene esta funcion'})
    Producto.find({},{producto:1,cantidadVendida:1},(err, productoEncontrado) => {
        if (err) return res.status(500).send({mensaje: 'Erroraso papa'})
        if (!productoEncontrado) return res.status({mensaje:'MMMmm... error xd'})

        return res.status(200).send({ProductosMasVendidos:productoEncontrado})
    }).sort({cantidadVendida:-1}).limit(3)
}

module.exports = {
    registrarProducto,
    obtenerProductoId,
    obtenerProductos,
    editarProducto,
    obtenerProductoNombre,
    obtenerProductoIdCategoria,
    productosMasVendidos
}
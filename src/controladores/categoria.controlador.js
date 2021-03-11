'use strict'
const categoriaModel = require('../modelos/categoria.model');
const Categoria = require('../modelos/categoria.model')
const Producto = require('../modelos/producto.model')

function agregarCategoria(req,res){
    var params = req.body
    var categoriaModel = new Categoria();

    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden crear una categoria'})
    if(!params.categoria) return res.status(500).send({mensaje:'No puede enviar campos vacios'})
    categoriaModel.categoria = params.categoria;
    Categoria.find({categoria:categoriaModel.categoria}).exec((err,usuarioEncontrado) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion de usuario'})
        if (usuarioEncontrado && usuarioEncontrado.length >= 1) return res.status({mensaje:'La categoria ya existe'})
        categoriaModel.save((err, categoriaGuardada) => {
            if(err) return res.status(500).send({mensaje:'Error en la peticion al servidor'})
            if(categoriaGuardada){
                return res.status(200).send(categoriaGuardada);
            }else{
                return res.status(500).send({mensaje:'Error al guardar usuario'});
            }
        })
    })
}

function obtenerCategoria(req,res){
    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden crear una categoria'})
    Categoria.find({},(err,categoriasEncontradas) =>{
        if (err) return res.status(401).send({mensaje:'Error en la peticion de categorias'});
        if (!categoriasEncontradas) return res.status(500).send({mensaje:'Error en la peticion'});

        return res.status(200).send(categoriasEncontradas);
    })
}

function editarCategoria(req,res){
    var params = req.body;
    var idCategoria = req.params.idCategoria;
    var categoriaModel = new Categoria();

    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden crear una categoria'})
    Categoria.findByIdAndUpdate(idCategoria,{categoria: params.categoria},{new:true, useFindAndModify: false},(err, categoriaModificada) => {
        if(err) return res.status(500).send({mensaje:'Error en la peticion de categoria'});
        if(!categoriaModel) return res.status(500).send({mensaje:'Error al editar categorias'});

        return res.status(200).send({categoriaModificada}) 
    })
}

function eliminarCategoria(req,res){
    var idCategoria = req.params.idCategoria;
    
    if(req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden eliminar categorias'})
    categoriaDefault();
    Categoria.findByIdAndDelete(idCategoria,(err, categoriaEliminada) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion al servidor'});
        if (!categoriaEliminada) return res.status(500).send({mensaje:'Error al enviar los datos al servidor'});
        Categoria.findOne({categoria:'Default'},(err, categoriaDefault) =>{
            Producto.find({categoria:idCategoria}).exec((err, productosEncontrados) => {
                productosEncontrados.forEach(function(elemento){
                    Producto.findByIdAndUpdate(elemento._id,{categoria:categoriaDefault._id},{new:true},(err, productoActualizado) => {})
                })
            })
        })
        return res.status(200).send({CategoriaEliminada: categoriaEliminada});
    })
}

function categoriaDefault(){
    var categoriaModel = new Categoria();
    categoriaModel.categoria = 'Default'
    Categoria.find({categoria:'Default'}).exec((err, categoriaEncontrada) => {
        if (err) return console.log('Error en la peticion al servidor')
        if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
            return console.log('La categoria ya fue creada')
        }else{
            categoriaModel.save((err, categoriaGuardada) => {
                return console.log(categoriaGuardada)
            })
        }
     })
}

function obtenerCategoriaCliente(req,res){
    if (req.user.rol != 'Cliente') return res.status(500).send({mensaje:'Esta funcion es para clientes'})
    Categoria.find({},(err,categoriasEncontradas) =>{
        if (err) return res.status(401).send({mensaje:'Error en la peticion de categorias'});
        if (!categoriasEncontradas) return res.status(500).send({mensaje:'Error en la peticion'});

        return res.status(200).send(categoriasEncontradas);
    })
}

module.exports = {
    agregarCategoria,
    obtenerCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategoriaCliente
}
'use strict'
const Usuario = require('../modelos/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt');

function login(req,res){
    var params = req.body;
    Usuario.findOne({usuario:params.usuario},(err,usuarioEncontrado) => {
        if (err) return res.status(500).send({mensaje: 'Error en la peticion de usuario Usuario'});
        if (usuarioEncontrado){
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta) => {
                if (passCorrecta){
                    if (params.obtenerToken === 'true'){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado})
                    }
                }else{
                    return res.status(401).send({mensaje: 'El usuario no se ha podido identificar'})
                }
            })
        }else{
            return res.status(500).send({mensaje: 'Error al obtener usuario'});
        } 
    })
}

function registrarCliente(req,res){
    var usuarioModel = new Usuario;
    var params = req.body;

    if (params.usuario && params.password){
        usuarioModel.usuario = params.usuario;
        usuarioModel.rol = 'Cliente'
        Usuario.find({usuario: usuarioModel.usuario}).exec((err, usuarioEncontrado) => {
            if (err) return res.status(500).send({mensaje:'Error en la peticion de usuario'})
            if (usuarioEncontrado && usuarioEncontrado.length >= 1){
                return res.status(500).send({mensaje:'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err,passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) res.status(500).send({mensaje:'Error en la peticion al servidor'})
                        if(usuarioGuardado){
                            return res.status(200).send(usuarioGuardado);
                        }else{
                            return res.status(500).send({mensaje:'Error al guardar usuario'})
                        }
                    })
                })
            }
        })
    }else{
        return res.status(500).send({mensaje:'Llene todos los campos porfavor'})
    }
}

function registrarAdmin(req,res){
    var usuarioModel = new Usuario();
    var params = req.body;
    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden registrar Administradores'})
    if(params.usuario && params.password && params.rol){
        usuarioModel.usuario = params.usuario;
        usuarioModel.rol = params.rol;
        Usuario.find({usuario:usuarioModel.usuario}).exec((err, usuarioEncontrado) => {
            if (err) return res.status(500).send({mensaje:'Error en la obtencion de usuario'});
            if (usuarioEncontrado && usuarioEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'El usuario ya existe'})
            }else{
                if(params.rol == 'Administrador' || params.rol == 'Cliente'){
                    bcrypt.hash(params.password,null,null,(err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;
                        usuarioModel.save((err, usuarioGuardado) =>{
                            if (err) return res.status(500).send({mensaje:'Error al guardar Usuario'});
                            if(usuarioGuardado){
                                return res.status(200).send(usuarioGuardado);
                            }else{
                                return res.status(500).send({mensaje:'Error al guardar el usuario en contrasena'})
                            }
                        })
                    })
                }else{
                    return res.status(500).send({mensaje:`Error al ingresar rol, para un Administrador usar 'Administrador' y para un clliente usar 'Cliente'`})
                }
            }
        })
    }else{
        return res.status(500).send({mensaje:'Ingrese todos los datos porfavor'});
    }
}

function editarRol(req,res){
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    delete params.password;
    if (req.user.rol != 'Administrador') return res.status(500).send({mensaje:'Solo los administradores pueden editar Administradores'})
    if(params.rol == 'Administrador'){
        Usuario.findOneAndUpdate({_id:idUsuario, rol:'Cliente'},{rol: params.rol},{new:true, useFindAndModify: false},(err, usuarioActualizado) => {
            if (err) return res.status(500).send({mensaje: 'Error en la peticion no se puede actializar usuarios Administradores'});
            if (!usuarioActualizado) return res.status(500).send({mensaje:'Error no se puede actializar usuarios Administradores'})
    
            return res.status(200).send({usuarioActualizado});
        })
    }else{
        return res.status(500).send({mensaje:`Error al ingresar rol, para un Administrador usar 'Administrador'`})
    }
}

module.exports = {
    login,
    registrarCliente,
    registrarAdmin,
    editarRol
}
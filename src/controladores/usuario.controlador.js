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

module.exports = {
    login,
    registrarCliente
}
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

module.exports = {
    login
}
'use strict'
const mongoose = require("mongoose");
const app = require("./app");
const bcrypt = require("bcrypt-nodejs")
const Usuario = require("./src/modelos/usuario.model")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/ventaOnline",{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    
    console.log('Esta conectado a la base de datos');
    app.listen(3000, function(){
        console.log('Corriendo en el puerto 3000');

        var usuarioModel = new Usuario();
        usuarioModel.usuario = 'ADMIN';
        var password = '123456';
        usuarioModel.rol = 'Administrador';

        Usuario.find({usuario: usuarioModel.usuario}).exec((err, usuarioEncontrado) => {
            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return console.log('El usuario Administrador ya fue creado');
            }else{
                bcrypt.hash(password, null,null,(err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el usuario'})
                        if (usuarioGuardado){
                            return console.log(usuarioGuardado);
                        }else{
                            return res.status(404).send({mensaje:'No se ha podido guardar el usuario'})
                        }
                    })
                })
            }
        })
    })
}).catch(err => console.log(err))
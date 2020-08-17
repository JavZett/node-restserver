const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require("../models/usuario");

const app = express();

app.get("/usuario", (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuariosMostardos: usuarios.length,
                    resgistrados: conteo,
                    usuarios
                });
            });
        });

});

app.post("/usuario", (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // usuarioDB.password = null;
        res.json({ ok: true, usuario: usuarioDB });
    });
});
app.put("/usuario/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete("/usuario/:id", (req, res) => {
    let id = req.params.id;

    //Eliminar físicamente de la base de datos
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //             //message; 'Usuario no encontrado'
    //         });
    //     }
    //     if (!usuarioBorrado) {  //usuarioBorrado === null
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

    //Cambiar estado a false
    Usuario.findByIdAndUpdate(id, { estado: false, runValidators: true }, (err, usuarioDesactivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
                //message; 'Usuario no encontrado'
            });
        }
        if (!usuarioDesactivado) {  //usuarioBorrado === null
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDesactivado
        });
    });
});

module.exports = app;

//Clave de base de datos mongo atlas: lUTktX4G0ZkxPOOw user: mariachi
//mongodb+srv://mariachi:<password>@cluster0.gvzxn.mongodb.net/test
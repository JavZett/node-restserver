const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');
let app = express();
const _ = require('underscore');
let Categoria = require('../models/categoria');
//Mostrar todas las categorías
app.get('/categorias', verificaToken, (req, res) => {
    Categoria.find()
        .sort('description') //ordenar
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categoriasR: conteo,
                    categorias
                });
            });
        });
});
//Mostrar categoría por ID
app.get('/categorias/:id', verificaToken, (req, res) => {
    let categoria_id = req.params.id;
    Categoria.findById(categoria_id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoría no encontrada'
                },
                err //temporal
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
//Crear nueva categoria
app.post('/categorias', verificaToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario._id;
    let categoria = new Categoria({
        description: body.descripcion,
        usuario
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Categoría guardada',
            categoria: categoriaDB
        });
    });
});
app.put('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    //let body = JSON.parse(JSON.stringify(req.body)); //Puede usarse para evitar el "[Object: null prototype]"
    let body = req.body;
    Categoria.findByIdAndUpdate(id, body, { new: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        console.log(body);
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.delete('/categorias/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            usuario: categoriaBorrada
        });
    });
});

module.exports = app;
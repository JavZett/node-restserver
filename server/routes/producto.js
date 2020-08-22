const express = require('express');
const { verificaToken } = require('../middlewares/autentication');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre')
        .populate('categoria', 'description')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!productos) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            Producto.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    productosR: conteo,
                    productos
                });
            });
        });
});

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});
//Buscar Productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario._id;
    let producto = new Producto({
        usuario,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al agregar el producto',
                err
            });
        }
        res.json({
            ok: true,
            message: 'Producto agregado',
            Producto: productoDB
        });
    });
});

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['disponible', 'precioUni', 'descripcion']);
    Producto.findByIdAndUpdate(id, body, { new: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoActualizado: productoDB
        });
    })
});

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});
module.exports = app;
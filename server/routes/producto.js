const express = require('express');
const { verificaToken, verificaRole } = require('../middlewares/autentificacion');
const app = express();

let Producto = require('../models/producto.js');


// ================================
// Mostrar todas los producto
// ================================
app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productos
            })
        })

})


// ================================
// Mostrar una categoria por ID
// ================================
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        messsage: "Producto no encotrado"
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })


})

// ================================
// Buscar un  producto
// ================================
app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productos
            })
        })

})


// ================================
// Crear una categoria
// ================================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "Producto no encotrada"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})


// ================================
// Actualizar una categoria
// ================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "Producto no encotrada"
                }
            })
        }
        if (body.nombre)
            productoDB.nombre = body.nombre;
        if (body.precioUni)
            productoDB.precioUni = body.precioUni;
        if (body.descripcion)
            productoDB.descripcion = body.descripcion;
        if (body.disponible)
            productoDB.disponible = body.disponible;
        if (body.categoria)
            productoDB.categoria = body.categoria;

        productoDB.save((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
    })
})

// ================================
// Borrar una categoria
// ================================
app.delete('/productos/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

    let disponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponible, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "productoDB no encotrado"
                }
            })
        }

        res.json({
            ok: true,
            messsage: 'producto borrado'
        })
    })
})

module.exports = app;


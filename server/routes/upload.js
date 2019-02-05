const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());


const Usuario = require('../models/usuarios');
const Producto = require('../models/producto');

app.post('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposPermitidas = ['usuarios', 'productos'];
    if (tiposPermitidas.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messsage: 'Los tipos validas son ' + tiposPermitidas.join(', ')
            }
        });
    }

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messsage: "No hay archivos"
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let extensionesPermitidas = ['jpg', 'jpeg', 'gif', 'png'];


    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messsage: 'Las extensiones validas son ' + extensionesPermitidas.join(', ')
            }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios')
            uploadUsuario(id, res, nombreArchivo)
        else
            uploadProducto(id, res, nombreArchivo);

    });
});

function uploadUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: 'Usuario no existe'
                }
            })
        }

        borraArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        })


    })

}


function uploadProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: 'Producto no existe'
                }
            })
        }

        borraArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })


    })

}

function borraArchivo(tipo, nombreImagen) {
    let pahtImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pahtImagen)) {
        fs.unlinkSync(pahtImagen)
    }
}

module.exports = app;
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autentificacion');


app.get('/imagen/:tipo/:img', verificaTokenImg, function (req, res) {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pahtImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pahtImagen)) {
        res.sendFile(pahtImagen);
    }
    else {
        let noImagen = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagen);
    }



});

module.exports = app;
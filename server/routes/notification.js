const express = require('express');
const { verificaToken, verificaRole } = require('../middlewares/autentificacion');
const app = express();

let BillingNotificationModel = require('../models/BillingNotification.js');

router.post('/notification', async function (req, res) {

    let notification = new BillingNotificationModel();
    notification.message = req.body;

    console.log(req.body);

    notification.save();
    res.json("Get Notification");


});

module.exports = app;
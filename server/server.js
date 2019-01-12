require('./config/config')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// respond with "hello world" when a GET request is made to the homepage
app.get('/usuario', function (req, res) {
    res.json('get usuario');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto ", process.env.PORT);
})
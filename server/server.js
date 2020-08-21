require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//hibilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuración global de rutas
app.use(require('./routes/index'));

// mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
//   if (err) throw err;
//   console.log('DB online');
// });
let coneccionDB = async () => {
    await mongoose.connect(process.env.urlDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    });
}
coneccionDB().then(() => {
    console.log('Conexion Exitosa');
}).catch(err => console.log(err));

app.listen(process.env.PORT, () => console.log('Escuchando puerto: ', process.env.PORT));
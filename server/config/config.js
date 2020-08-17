//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno Saber si se stá en desarrollo o en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.urlDB = urlDB;
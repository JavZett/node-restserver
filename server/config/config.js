//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno Saber si se stá en desarrollo o en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del Token
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';


//Seed de autencicación

process.env.SEED = process.env.SEED || 'seed-secret-desarrollo';


//Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.urlDB = urlDB;

process.env.CLIENT_ID = process.env.CLIENT_ID || '1082002182900-t9omv0nirig8baes6vccueql4tvg8vpi.apps.googleusercontent.com'; 
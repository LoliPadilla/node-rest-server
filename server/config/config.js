
// =========================
// Puerto
// =========================

process.env.PORT = process.env.PORT || 8080;

// =========================
//Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =========================
// Base de datos
// =========================

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
}
else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;


// =========================
// Token
// =========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =========================
// Google Client ID
// =========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '938798167689-r9396ih03pdmb94ls0n0g3a98d7skk1p.apps.googleusercontent.com';
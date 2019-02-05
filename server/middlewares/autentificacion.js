

const jwt = require('jsonwebtoken');

// ======================
// Verificar Token
// ======================

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "token no valido"
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}

// ======================
// Verificar Token Imagen
// ======================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;
    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "token no valido"
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}


// ======================
// Verificar role
// ======================
let verificaRole = (req, res, next) => {

    let role = req.usuario.role;

    if (role !== 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                message: "El usuario no tiene permisos de administracion"
            }
        })
    }

    next();

}



module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenImg
}
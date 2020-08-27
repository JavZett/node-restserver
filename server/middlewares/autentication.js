const jwt = require('jsonwebtoken');
//Verificar Token
let verificaToken = (req, res, next) => {
    let token = req.get('authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

//Verfica Admin Role
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario.role;

    if (usuario === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es admin'
            }
        });
    }
}
//Verifica Token Imagen
let verificaTokenImg = (req, res, next) => {
    let authorization = req.query.authorization; //authorization = token
    jwt.verify(authorization, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}
module.exports = { verificaToken, verificaAdmin_Role, verificaTokenImg }
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error: 'No token provided'});
    }

    //formato de token
    //começa com Bearer lkvjddfjsjf e algo muito louco em seguida
    //verificação de partes do token
    const parts = authHeader.split(' ');

    if(!parts.length === 2){
        return res.status(401).send({error: 'Token error'});
    }
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token malformatted'});
    }
    //aqui verificaremos o token, tem que bater com o secret para ir para o next()
    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err){
            return res.status(401).send({ error: 'Token invalid'});
        }
        req.userId = decoded.id;
        return next();
    });
}
//aqui é o interceptador, se o usuario não estiver autenticado, ele para, senao, ele continua
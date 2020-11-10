const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/user');

const router = express.Router();

//aqui criaremos tokens a partir do authconfig em /config/
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400, //em um dia isso expirará
    })
}

router.post('/register', async (req, res)=>{
    const { email } = req.body;
    try{
        if(await User.findOne({ email })){
            return res.status(400).send({ error: 'User already exists' })
        }
        const user = await User.create(req.body);
        //aqui apaga a senha do objeto user, para que não exiba.
        user.password = undefined;

        //aqui ele retorna o objeto usuario
        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch(err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});
router.post('/authenticate', async (req, res)=>{
    //recebemos email e senha na hora da autenticação
    const { email, password } = req.body;
    //como foi definido que não viria um array de senhas usaremos o select(+password)
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return res.status(400).send({ error: 'User not found'});
    }
    //comparo o password login(desencripitado), com o password db(encriptado)
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: 'Invalid password'});
    }
    //aqui apaga a senha do objeto user, para que não exiba.
    user.password = undefined;
    //aqui criaremos tokens a partir do authconfig em /config/
    const token = 

    res.send({ 
        user,
        token: generateToken({ id: user.id }),
    });
})
//aqui chamo app e passo router depois de /auth, ficando /auth/register
module.exports = app => app.use('/auth', router);
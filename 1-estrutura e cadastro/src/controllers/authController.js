const express = require('express');

const User = require('../models/user');

const router = express.Router();

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
        return res.send({ user });
    } catch(err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});
//aqui chamo app e passo router depois de /auth, ficando /auth/register
module.exports = app => app.use('/auth', router);
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

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
router.post('/forgot_password', async (req, res)=>{
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        //retorna falso senão encontrar o usuario
        if(!user){
            return res.status(400).send({ error: 'User not found'});
        }
        //aqui crio uma token aleatoria de 20 caracteres e em string hex
        const token = crypto.randomBytes(20).toString('hex');

        //agora darei um tempo de inspiração de 1 hora e será salvo no branco de dados
        const now = new Date();
        now.setHours(now.getHours() + 2);
        

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });
        
        mailer.sendMail({
            to: email,
            from: 'setRemetente',
            template: 'auth/forgot_password',
            context: { token },
        }, (err)=>{
            if(err){
                return res.status(400).send({error: 'Cannot send forgot password email'});
            }
            return res.send(); //retorna status 200 se tudo correr bem.
        })
    } catch(err){
        res.status(400).send({ error: 'Erro on forgot password, try again'});
    }
})
router.post('/reset_password', async (req, res)=>{
    const { email, token, password } = req.body;

    try{
        //aqui pegamos do mongodb email, o token, e a expiração do token
        const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');
        
        if(!user){
            //aqui verificamos se o usuario existe no mongodb
            return res.status(400).send({ error: 'User not found'});
        }
        if(token !== user.passwordResetToken){
            //aqui verificamos se o token do formulario bate com o do mongodb
            return res.status(400).send({ error: 'Token invalid'});
        }
        //aqui pegamos a data atual para comparação
        const now = new Date();

        if(now > user.passwordResetExpires){
            //aqui comparamos se a expiração é valida no momento
            return res.status(400).send({ error: 'Token expired, get a new one'});
        }
        //se tudo correr bem, o password será trocado.
        user.password = password; 

        //agora salvamos a alteração
        await user.save();
        
        res.send();

    }catch(err){
        res.status(400).send({ error: 'Cannot reset password, try again'});
    }
});
//aqui chamo app e passo router depois de /auth, ficando /auth/register
module.exports = app => app.use('/auth', router);
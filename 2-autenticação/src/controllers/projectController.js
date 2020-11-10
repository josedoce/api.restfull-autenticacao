const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

//funçao de verificação do token usando o middlewares
router.use(authMiddleware);

router.get('/', (req, res)=>{
    res.send({ ok: 'usuario autenticado', user: req.userId });
})

module.exports = app => app.use('/projects', router);

//vira aqui se tiver autenticado
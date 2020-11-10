const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//para pegar os parametros, temos que definir o uso do bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//passando app para o authController.js
require('./controllers/authController')(app);

//aqui defino a porta onde será aberta o projeto
app.listen('3333',()=>{
    console.log('conectado com sucesso!');
})

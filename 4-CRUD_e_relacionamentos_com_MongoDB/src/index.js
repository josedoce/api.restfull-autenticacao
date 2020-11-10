const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//para pegar os parametros, temos que definir o uso do bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//passando app para index e assim index passando para todo o diretorio controller
require('./app/controllers/index')(app);

app.listen('3333',()=>{
    console.log('conectado com sucesso!');
})

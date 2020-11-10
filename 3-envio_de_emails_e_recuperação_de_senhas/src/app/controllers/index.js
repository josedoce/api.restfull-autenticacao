const fs = require('fs');
const path = require('path');

//isso irá exportar (app) para todos os arquivos que não sejam o index.js
module.exports = app => {
    fs .readdirSync(__dirname) //leitura no diretorio
        .filter(file=>((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach(file=>require(path.resolve(__dirname, file))(app))
};
//e agora todo controler criado aqui será automaticamente importado o (app)
const mongoose = require('mongoose');

//aqui configuro a conexão com o mongo db
mongoose.connect(
    'mongodb://localhost:27017/animais', //aqui eu crio ou uso um banco que já existe.
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);
//configuração padão em todo projeto com mongoose
mongoose.Promise = global.Promise;

//aqui exporto a conexão com o mongo db
module.exports = mongoose;
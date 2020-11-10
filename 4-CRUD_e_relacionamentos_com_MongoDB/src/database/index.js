const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://localhost:27017/usuario',
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
//configuração padão em todo projeto com mongoose

mongoose.Promise = global.Promise;

module.exports = mongoose;
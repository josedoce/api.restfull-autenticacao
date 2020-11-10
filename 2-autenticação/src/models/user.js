const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//aqui defino quais campos teremos no banco de dados.
const UserSchema = new mongoose.Schema({
   name: {
        type: String,   //do tipo string
        required: true, //será obrigatorio
   },
   email: {
        type: String,
        unique: true, //será dado unico
        required: true,
        lowercase: true, //será minúscula
   },
   password: {
        type: String,
        required: true,
        select: false, //não quero que venha esses dados em um array
   },
   createdAt: {
       type: Date,
       default: Date.now,
   }
});

//com a funçao pre() do mongoose, a gente avisa que quer que algo aconteça antes de salvar
UserSchema.pre('save', async function(next){
     //podemos usar o this. que referencia ao que será salvo
                                   //melhor opção de rounds hash é 10
     const hash = await bcrypt.hash(this.password, 10);
     this.password =  hash;
     next();
})

//aqui defino o model no mongoose
const User = mongoose.model('User', UserSchema);

module.exports = User;
const mongoose = require('../../database');

//aqui defino quais campos teremos no banco de dados.
const ProjectSchema = new mongoose.Schema({
   title: {
        type: String,   //do tipo string
        required: true, //será obrigatorio
   },
   description: {
       type: String,
       require: true,
   },
   user: {
       //aqui faço referencia ao model 'User', uma especie de relacionamento
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       require: true,
   },
   tasks: [{
       //aqui faço referencia ao model 'Task', uma especie de relacionamento
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Task',
   }],
   createdAt: {
       type: Date,
       default: Date.now,
   }
});

//aqui defino o model no mongoose
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
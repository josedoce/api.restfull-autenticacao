const mongoose = require('../../database');

//aqui defino quais campos teremos no banco de dados.
const TaskSchema = new mongoose.Schema({
   title: {
        type: String,   //do tipo string
        required: true, //será obrigatorio
   },
   project: {
       //aqui faço referencia ao model 'Project', uma especie de relacionamento
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Project',
       require: true,
   },
   assignedTo: {
       //aqui faço referencia ao model 'User', uma especie de relacionamento
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       require: true,
   },
   completed: {
       type: Boolean,
       require: true,
       default: false, //valor padrao
   },
   createdAt: {
       type: Date,
       default: Date.now,
   }
});

//aqui defino o model no mongoose
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
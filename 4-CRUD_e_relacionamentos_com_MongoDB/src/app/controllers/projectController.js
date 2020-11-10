const express = require('express');
const authMiddleware = require('../middlewares/auth');
//aqui é area restrita ao token, nenhum usuario terá acesso sem autenticaçao

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();
//funçao de verificação do token
router.use(authMiddleware);

router.get('/', async (req, res)=>{
    //list
    try {
        //aqui retorno todos os projetos com informações relacionadas sobre o user
        const projects = await Project.find().populate(['user','tasks']);
        return res.send({ projects });

    } catch (error) {
        return res.status(400).send({ error: 'Error loading projects'});
    }
});
router.get('/:projectId', async (req, res)=>{
    //show
    try {
        //aqui retorno todos os projetos com informações relacionadas sobre o user
        const project = await Project.findById(req.params.projectId).populate(['user','tasks']);
        return res.send({ project });

    } catch (error) {
        return res.status(400).send({ error: 'Error loading project'});
    }
});
router.post('/', async (req, res)=>{
    //create
    try {
        const { title, description, tasks } = req.body;
        //user.userId esta vindo com a requisição do token no midle
        const project = await Project.create({title, description, user: req.userId});
        await Promise.all(tasks.map(async task=>{
            //criando a task
            const projectTask = new Task({ ...task, project: project._id });
            //salvando as tasks
            await projectTask.save();

            project.tasks.push(projectTask);
        }));
        await project.save();

        return res.send({ project });
    } catch (error) {
        return res.status(400).send({ error: 'Error creating new project' });
    }
});
router.put('/:projectId', async (req, res)=>{
    //atualizar
    try {
        const { title, description, tasks } = req.body;
        //user.userId esta vindo com a requisição do token no midle
        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title,
            description,
        }, { new: true /**retorna os dados atualizados, não os antigos */});

        //apague todas as tasks relacionadas a esse id
        project.tasks = [];
        await Task.remove({ project: project._id });
        //agora crie novos dados
        await Promise.all(tasks.map(async task=>{
            //criando a task
            const projectTask = new Task({ ...task, project: project._id });
            //salvando as tasks
            await projectTask.save();

            project.tasks.push(projectTask);
        }));
        await project.save();

        return res.send({ project });
    } catch (error) {
        return res.status(400).send({ error: 'Error updating project' });
    }
});
router.delete('/:projectId', async (req, res)=>{
    //apagar
    try {
        //aqui retorno todos os projetos com informações relacionadas sobre o user
        await Project.findByIdAndRemove(req.params.projectId);
        return res.send();

    } catch (error) {
        return res.status(400).send({ error: 'Error deleting project'});
    }
});
module.exports = app => app.use('/projects', router);
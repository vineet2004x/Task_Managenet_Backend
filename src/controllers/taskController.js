
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

exports.createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.create({
            title,
            description,
            status,
            userId: req.user.id
        });

        await ActivityLog.create({
            action: 'CREATE_TASK',
            details: `Created task: ${title}`,
            userId: req.user.id
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        await task.save();

        await ActivityLog.create({
            action: 'UPDATE_TASK',
            details: `Updated task: ${task.title}`,
            userId: req.user.id
        });

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        const taskTitle = task.title;
        await task.destroy();

        await ActivityLog.create({
            action: 'DELETE_TASK',
            details: `Deleted task: ${taskTitle}`,
            userId: req.user.id
        });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

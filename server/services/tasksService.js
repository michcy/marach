const tasksModel = require('../models/tasksModel');

async function getAllTasks(request, response) {
    try {
        const tasks = await tasksModel.getAllTasks();
        response.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        response.status(500).json({error: 'Failed to fetch tasks'});
    }
}

async function getTaskById(request, response) {
    try {
        const task = await tasksModel.getTaskById(request.params.id);
        if (!task) {
            return response.status(404).json({error: "Task not found"});
        }
        if (task.userId !== request.user.id) {
            return response.status(403).json({error: "Forbidden"});
        }
        response.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        response.status(500).json({error: 'Failed to fetch task'});
    }
}

async function getTasksByUserId(request, response) {
    try {
        if (!request.params.id) {
            return response.status(400).json({error: "User ID is required"});
        }
        if (request.user.id !== request.params.id) {
            return response.status(403).json({error: "Forbidden"});
        }
        const limit = parseInt(request.query.limit) || 15
        const page = parseInt(request.query.page) || 1
        const query = request.query.query || ''
        const tasks = await tasksModel.getTasksByUserId(request.params.id, query, limit, page);
        if (!tasks) {
            return response.status(404).json({error: "Tasks not found"});
        }
        response.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        response.status(500).json({error: 'Failed to fetch tasks'});
    }
}

async function createTask(request, response) {
    try {
        const isValid = tasksModel.validateTask(request.body)
        if (!isValid) {
            return response.status(400).json({error: "Title is required"});
        }
        const task = await tasksModel.createTask(request.body, request.user.id)
        response.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        response.status(500).json({error: 'Failed to creating task'});
    }
}

async function getTaskDone(request, response) {
    try {
        const task = await tasksModel.getTaskById(request.params.id);
        if (!task) {
            return response.status(404).json({error: "Task not found"});
        }
        if (task.completedAt) {
            return response.status(400).json({error: "Task is already marked as done"});
        }
        await tasksModel.getTaskDone(request.params.id);
        response.status(200).json({message: "Task marked as done successfully"});
    } catch (error) {
        console.error('Error marking task as done:', error);
        response.status(500).json({error: 'Failed to mark task as done'});
    }
}

async function updateTask(request, response) {
    try {
        const task = await tasksModel.getTaskById(request.params.id);
        if (!task) {
            return response.status(404).json({error: "Task not found"});
        }
        if (task.userId !== request.user.id) {
            return response.status(403).json({error: "Forbidden"});
        }
        await tasksModel.updateTask(request.params.id, request.body);
        response.status(200).json({message: "Task updated successfully"});
    } catch (error) {
        console.error('Error updating task:', error);
        response.status(500).json({error: 'Failed to update task'});
    }
}

async function deleteTask(request, response) {
    try {
        const task = await tasksModel.getTaskById(request.params.id);
        if (!task) {
            return response.status(404).json({error: "Task not found"});
        }
        if (task.userId !== request.user.id) {
            return response.status(403).json({error: "Forbidden"});
        }
        await tasksModel.deleteTask(request.params.id);
        response.status(200).json({message: "Task deleted successfully"});
    } catch (error) {
        console.error('Error updating task:', error);
        response.status(500).json({error: 'Failed to update task'});
    }
}


module.exports = {
    getAllTasks,
    getTaskById,
    getTasksByUserId,
    createTask,
    getTaskDone,
    updateTask,
    deleteTask,
}
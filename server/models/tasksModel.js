const pool = require("../database/mysql");

async function getAllTasks() {
    const [response] = await pool.promise().query('SELECT * FROM tasks')
    return response
}

async function getTaskById(id) {
    const [task] = await pool.promise().query('SELECT * FROM tasks WHERE id = ?', [id])
    return task[0]
}

async function getTasksByUserId(id, query, limit, page) {
    const [tasks] = await pool.promise().query('SELECT * FROM tasks WHERE userId = ? and title LIKE ? OR description LIKE ? limit ? offset ?', [id, `%${query}%`, `%${query}%`, limit, (page - 1) * limit])
    return tasks
}

async function createTask(body, userId) {
    const task = {
        id: crypto.randomUUID(),
        title: body.title,
        description: body.description || null,
        createdAt: new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        completedAt: null,
        userId: userId,
    }
    await pool.promise().query('INSERT INTO tasks (id, title, description, createdAt, dueDate, completedAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)', [task.id, task.title, task.description, task.createdAt, task.dueDate, task.completedAt, task.userId])
}

async function getTaskDone(id) {
    const completedAt = new Date()
    return await pool.promise().query('UPDATE tasks SET completedAt = ? WHERE id = ?', [completedAt, id])
}

function validateTask(body) {
    return !(!body || !body.title)
}

async function updateTask(id, body) {
    return await pool.promise().query("UPDATE tasks SET title = ?, description = ?, dueDate = ? WHERE id = ?", [body.title, body.description, body.dueDate, id])
}

async function deleteTask(id) {
    return await pool.promise().query("DELETE FROM tasks WHERE id = ?", [id])
}

module.exports = {
    getAllTasks,
    getTaskById,
    getTasksByUserId,
    createTask,
    getTaskDone,
    validateTask,
    updateTask,
    deleteTask,
}
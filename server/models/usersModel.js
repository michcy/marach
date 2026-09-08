const pool = require('../database/mysql.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function getAllUsers(limit, offset) {
    const [response] = await pool.promise().query('SELECT * FROM users limit ? OFFSET ?', [limit, offset])
    return response
}

async function getUserById(id) {
    const [user] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [id])
    return user[0]
}

async function getUserByUsername(username) {
    const [user] = await pool.promise().query('SELECT * FROM users WHERE username = ?', [username])
    return user[0]
}

async function getUserByEmail(email) {
    const [user] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email])
    return user[0]
}

async function createUser(body) {
    const {username, email, password} = body
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const id = crypto.randomUUID()
    const date = new Date();
    const createdAt = date.toISOString().slice(0, 19).replace('T', ' ');

    await pool.promise().query('INSERT INTO users (id, email, username, password, createdAt, lastLoggedAt, role) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, email, username, hashedPassword, createdAt, null, 'user'])
}

function validateUser(username, email, password) {
    return !(!username || !email || !password);
}

async function usernameExists(username) {
    return await pool.promise().query("SELECT username FROM users where username = ?", [username])
}

async function emailExists(email) {
    return await pool.promise().query("SELECT email FROM users where email = ?", [email])
}

async function updateUser(id, username, email, password) {
    const user = await getUserById(id)
    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : user.password
    return await pool.promise().query("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?", [username || user.username , email || user.email, hashedPassword, id])
}

async function deleteUser(id) {
    return await pool.promise().query("DELETE FROM users WHERE id = ?", [id])
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    createUser,
    validateUser,
    usernameExists,
    emailExists,
    updateUser,
    deleteUser
}

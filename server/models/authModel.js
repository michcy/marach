const pool = require('../database/mysql.js');

async function updateLastLoggedAt(username) {
    try {
        return await pool.promise().query('UPDATE users SET lastLoggedAt = NOW() WHERE username = ?', [username])
    } catch (error) {
        console.error('Error updating lastLoggedAt:', error)
    }
}

module.exports = {
    updateLastLoggedAt
}
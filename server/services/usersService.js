const usersModel = require('../models/usersModel.js')

async function getUsers(request, response) {
    try {
        const limit = parseInt(request.query.limit) || 15
        const page = parseInt(request.query.page) || 1
        response.json(await usersModel.getAllUsers(limit, (page - 1) * limit)).status(200)
    } catch (error) {
        console.error('Error fetching users:', error)
        response.status(500).json({error: 'Failed to fetch users'})
    }
}

async function getUsersById(request, response) {
    try {
        const user = await usersModel.getUserById(request.params.id)
        if (!user) {
            return response.status(404).json({error: "User not found"});
        }
        response.json(user).status(200)
    } catch (error) {
        console.error('Error fetching user:', error)
        response.status(500).json({error: 'Failed to fetch user'})
    }
}

async function getUsersByUsername(request, response) {
    try {
        const user = await usersModel.getUserByUsername(request.params.username)
        if (!user) {
            return response.status(404).json({error: "User not found"});
        }
        response.json(user).status(200)
    } catch (error) {
        console.error('Error fetching user:', error)
        response.status(500).json({error: 'Failed to fetch users'})
    }
}

async function getUsersByEmail(request, response) {
    try {
        const user = await usersModel.getUserByEmail(request.params.email)
        if (!user) {
            return response.status(404).json({error: "User not found"});
        }
        response.json(user).status(200)
    } catch (error) {
        console.error('Error fetching user:', error)
        response.status(500).json({error: 'Failed to fetch users'})
    }
}

async function createUser(request, response) {
    if (!request.body) {
        return response.status(400).json({error: "Invalid request"});
    }
    const emailExists = await usersModel.emailExists(request.body.email)
    if (emailExists[0].length > 0) {
        return response.status(409).json({error: "Email already exists"});
    }
    const usernameExists = await usersModel.usernameExists(request.body.username)
    if (usernameExists[0].length > 0) {
        return response.status(409).json({error: "Username already exists"});
    }
    const isValid = await usersModel.validateUser(request.body.username, request.body.email, request.body.password)
    if (!isValid) {
        return response.status(422).json({error: "Invalid user data"});
    }
    await usersModel.createUser(request.body);
    response.status(201).json({message: "User created successfully"})
}

async function updateUser(request, response) {
    const user = await usersModel.getUserById(request.params.id)
    if (!user) {
        return response.status(404).json({error: "User not found"});
    }
    if (!request.body) {
        return response.status(400).json({error: "Invalid request"});
    }
    const usernameExists = await usersModel.usernameExists(request.body.username)
    if (usernameExists[0].length > 0 && usernameExists[0][0].username !== user.username) {
        return response.status(409).json({error: "Username already exists"});
    }
    const emailExists = await usersModel.emailExists(request.body.email)
    if (emailExists[0].length > 0 && emailExists[0][0].email !== user.email) {
        return response.status(409).json({error: "Email already exists"});
    }
    await usersModel.updateUser(request.params.id, request.body.username, request.body.email, request.body.password)
    response.status(200).json({message: "User updated successfully"})
}

async function deleteUser(request, response) {
    const user = await usersModel.getUserById(request.params.id)
    if (!user) {
        return response.status(404).json({error: "User not found"});
    }
    await usersModel.deleteUser(request.params.id)
    response.status(204).json({message: "User deleted successfully"})
}

module.exports = {
    getUsers,
    getUsersById,
    getUsersByUsername,
    getUsersByEmail,
    createUser,
    updateUser,
    deleteUser
}

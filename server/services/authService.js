const usersModel = require('../models/usersModel')
const bcrypt = require('bcrypt')
const usersService = require('./usersService.js')
const authModel = require('../models/authModel.js')
const jwt = require("jsonwebtoken");

async function login(request, response) {
    try {
        if (hasValidSession(request)) {
            return response.status(400).json({error: "Already logged in"})
        }
        if (!request.body || !request.body.username || !request.body.password) {
            return response.status(400).json({error: "Invalid request"})
        }
        const {username, password} = request.body
        const searchUser = await usersModel.getUserByUsername(username)
        const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuvKX8h1J5vQ3nF7yZ9mR2sT6wL4pC1dOe'
        if (!searchUser) {
            await bcrypt.compare(password, DUMMY_HASH)
            return response.status(401).json({error: "Invalid username or password"})
        }
        const isPasswordValid = await bcrypt.compare(password, searchUser.password)
        if (!isPasswordValid) {
            return response.status(401).json({error: "Invalid username or password"})
        }
        await authModel.updateLastLoggedAt(username)
        const expiresInSeconds = 3600
        const token = jwt.sign({
            id: searchUser.id,
            username: searchUser.username,
            role: searchUser.role
        }, process.env.JWT_SECRET, {expiresIn: expiresInSeconds})
        response.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: expiresInSeconds * 1000,
        })
        response.status(200).json({message: "Login successful"})
    } catch (error) {
        response.clearCookie('token')
        console.error('Error during login:', error)
        response.status(500).json({error: 'Failed to login'})
    }
}

function hasValidSession(request) {
    const tokenValue = request.cookies?.token
    if (!tokenValue) return false
    try {
        jwt.verify(tokenValue, process.env.JWT_SECRET)
        return true
    } catch {
        return false
    }
}

async function register(request, response) {
    try {
        if (hasValidSession(request)) {
            return response.status(400).json({error: "Already logged in"})
        }
        await usersService.createUser(request, response)
    } catch (error) {
        console.error('Error during registration:', error)
        response.status(500).json({error: 'Failed to register'})
    }
}

async function logout(request, response) {
    try {
        response.clearCookie('token')
        return response.status(200).json({message: "Logout successful"})
    } catch (error) {
        console.error('Error during logout:', error)
        response.status(500).json({error: 'Failed to logout'})
    }
}

module.exports = {
    login,
    register,
    logout
}
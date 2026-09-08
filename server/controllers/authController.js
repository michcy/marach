const express = require('express')
const router = express.Router()
const authService = require('../services/authService.js')
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter.js')
module.exports = router

router.post('/login', loginLimiter, async (request, response) => {
    await authService.login(request, response)
})

router.post('/register', registerLimiter, async (request, response) => {
    await authService.register(request, response)
})

router.post('/logout', async (request, response) => {
    await authService.logout(request, response)
})
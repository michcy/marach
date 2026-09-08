// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP per window
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true, // adds RateLimit-* headers so clients can see remaining attempts
    legacyHeaders: false,
    skipSuccessfulRequests: true, // only count failed attempts, not successful logins
})

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 registrations per IP per hour (prevents mass account creation)
    message: { error: 'Too many accounts created, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = { loginLimiter, registerLimiter }
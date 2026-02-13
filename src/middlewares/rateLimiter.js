
const rateLimit = require('express-rate-limit');

// General API Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});

// Auth Limiter (Stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 5 login/register attempts per 15 mins
    message: { error: 'Too many login attempts, please try again later.' }
});

module.exports = { apiLimiter, authLimiter };

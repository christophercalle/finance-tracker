// Dependencies
const express = require('express')
const router = express.Router()

// Import controller functions
const { register, login } = require('../controllers/auth')

// Register route — creates a new user account
router.post('/register', register)

// Login route — verifies credentials and returns a JWT token
router.post('/login', login)

module.exports = router
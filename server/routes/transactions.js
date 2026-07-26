// Dependencies
const express = require('express')
const router = express.Router()

// Middleware
const verifyToken = require('../middleware/auth')

// Controller functions
const { createTransaction } = require('../controllers/transactions')

// Create transaction route — protected by JWT middleware
router.post('/', verifyToken, createTransaction)

module.exports = router
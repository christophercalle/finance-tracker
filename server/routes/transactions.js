// Dependencies
const express = require('express')
const router = express.Router()

// Middleware
const verifyToken = require('../middleware/auth')

// Controller functions
const { createTransaction, getTransactions, updateTransaction } = require('../controllers/transactions')

// Create transaction route — protected by JWT middleware
router.post('/', verifyToken, createTransaction)
router.get('/', verifyToken, getTransactions)
router.put('/:id', verifyToken, updateTransaction)


module.exports = router
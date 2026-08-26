const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')

// Route files
const authRoutes = require('./routes/auth')
const transactionRoutes = require('./routes/transactions')

// Middleware
const verifyToken = require('./middleware/auth')

// Parse incoming JSON request bodies
app.use(express.json())
app.use(cors())

// Register routes
app.use('/auth', authRoutes)
app.use('/transactions', transactionRoutes)

// Health check — confirms server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Finance Tracker API is running' })
})

// Database test — confirms database connection is working
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ connected: true, time: result.rows[0].now })
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message })
  }
})

// Protected test route — confirms JWT middleware is working
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', userId: req.user.userId })
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
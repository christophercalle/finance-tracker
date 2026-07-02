const express = require('express')
const app = express()
const pool = require('./db')

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Finance Tracker API is running' })
})

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ connected: true, time: result.rows[0].now })
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
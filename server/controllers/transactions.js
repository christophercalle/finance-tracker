// Dependencies
const pool = require('../db')

// CREATE TRANSACTION CONTROLLER
// Inserts a new transaction into the database for the logged in user
const createTransaction = async (req, res) => {

  // Pull transaction details from the request body
  const { amount, type, category, description, date } = req.body

  // Get the user's ID from the JWT token — attached by verifyToken middleware
  const user_id = req.user.userId

  try {
    // Insert the transaction into the database
    // RETURNING * sends back the full created transaction
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, type, category, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, amount, type, category, description, date]
    )

    // Respond with the created transaction — 201 means "Created"
    res.status(201).json({ transaction: result.rows[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createTransaction }










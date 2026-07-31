const pool = require('../db')


const createTransaction = async (req, res) => {
  const { amount, type, category, description, date } = req.body
  const user_id = req.user.userId

  try {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, type, category, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, amount, type, category, description, date]
    )

    res.status(201).json({ transaction: result.rows[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getTransactions = async (req, res) => {
  const user_id = req.user.userId

  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [user_id]
    )

    res.json({ transactions: result.rows })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createTransaction, getTransactions }
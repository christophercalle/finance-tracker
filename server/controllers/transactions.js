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


const updateTransaction = async (req, res) => {
  const { id } = req.params
  const { amount, type, category, description, date } = req.body
  const user_id = req.user.userId

  try {
    const result = await pool.query(
      'UPDATE transactions SET amount = $1, type = $2, category = $3, description = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [amount, type, category, description, date, id, user_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json({ transaction: result.rows[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


module.exports = { createTransaction, getTransactions, updateTransaction }
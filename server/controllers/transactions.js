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
  const { category, startDate, endDate } = req.query

  let query = 'SELECT * FROM transactions WHERE user_id = $1'
  let values = [user_id]
  let paramCount = 2

  if (category) {
    query += ` AND category = $${paramCount}`
    values.push(category)
    paramCount++
  }

  if (startDate) {
    query += ` AND date >= $${paramCount}`
    values.push(startDate)
    paramCount++
  }

  if (endDate) {
    query += ` AND date <= $${paramCount}`
    values.push(endDate)
    paramCount++
  }

  query += ' ORDER BY date DESC'

  try {
        const result = await pool.query(query, values)

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

const deleteTransaction = async (req,res) => {
  const { id } = req.params
  const user_id = req.user.userId

  try {
    const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    )

  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json({ transaction: result.rows[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

}



const getDashboard = async (req,res) => {
    const user_id = req.user.userId

    try {
      const totalsResult = await pool.query(
        `SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
        FROM transactions 
        WHERE user_id = $1`,
        [user_id]
      )

      const categoryResult = await pool.query(
        `SELECT category, SUM(amount) as total
        FROM transactions
        WHERE user_id = $1 AND type = 'expense'
        GROUP BY category
        ORDER BY total DESC`,
        [user_id]
      )

      const totals = totalsResult.rows[0]
      res.json({
        total_income: totals.total_income,
        total_expenses: totals.total_expenses,
        net_balance: totals.total_income - totals.total_expenses,
        spending_by_category: categoryResult.rows
      })
    }

    catch(err) {
      res.status(500).json({error: err.message })
    }
}



module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction, getDashboard }



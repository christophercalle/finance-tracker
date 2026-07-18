const pool = require('../db')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    )

    res.status(201).json({ user: newUser.rows[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { register }
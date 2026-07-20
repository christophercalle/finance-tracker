const pool = require('../db')
const bcrypt = require('bcrypt')



// REGISTER CONTROLLER
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



// LOGIN CONTROLLER 
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Compare password with hashed password
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    res.json({ message: 'Login successful', userId: user.id })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}




module.exports = { register, login }
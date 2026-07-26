// Dependencies
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// REGISTER CONTROLLER
// Creates a new user account with a hashed password
const register = async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if a user with this email already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    // If email is taken, reject the request
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Hash the password before storing — never store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user into the database
    // RETURNING sends back the created row without the password
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    )

    // Respond with the new user's data — 201 means "Created"
    res.status(201).json({ user: newUser.rows[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// LOGIN CONTROLLER
// Verifies credentials and returns a JWT token
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Look up the user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    // If no user found, reject with a vague error to prevent user enumeration
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Compare the plain text password against the stored hash
    const validPassword = await bcrypt.compare(password, user.password)

    // If password doesn't match, reject with the same vague error
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // Create a JWT token containing the user's ID, signed with the secret
    // Token expires in 7 days — user must log in again after that
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Send the token back to the client
    res.json({ token })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


module.exports = { register, login }
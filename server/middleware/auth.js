// Dependencies
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Middleware function that protects routes by verifying the JWT token
const verifyToken = (req, res, next) => {

  // Extract the token from the Authorization header (format: "Bearer <token>")
  const token = req.headers.authorization?.split(' ')[1]

  // If no token is provided, block the request
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the decoded payload (userId) to the request object for use in controllers
    req.user = decoded

    // Pass control to the next middleware or controller
    next()

  } catch (err) {
    // Token is invalid or expired
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = verifyToken
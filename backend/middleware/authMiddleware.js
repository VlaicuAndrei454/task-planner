const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract "Bearer" prefix
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };

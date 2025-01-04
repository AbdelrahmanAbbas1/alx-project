const jwt = require("jsonwebtoken");
const dontenv = require('dotenv');

dontenv.config();

const secretKey = process.env.JWT_SECRET_KEY;


exports.verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};
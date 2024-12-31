const pool = require('../../config/db');
const bcrypt = require('bcrypt')
const saltRounds = 10;

// Register a new user

exports.registerUser = async (req, res) => {
  const { user_name, user_email, password_hash } = req.body;

  if (!user_name || !user_email || !password_hash) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Authentication process
    const hashed_password = await bcrypt.hash(password_hash, saltRounds);
    const [result] = await pool.query(
      'INSERT INTO users (user_name, user_email, password_hash) VALUES (?, ?, ?)',
      [user_name, user_email, hashed_password]
    );
    res.status(201).json({ message: "User registered successfully", userId: result.insertId })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
}

// User Login

exports.loginUser = async (req, res) => {
  const { user_name, password_hash } = req.body;

  if (!user_name || !password_hash) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users where user_name = ? AND password_hash = ?',
      [user_name, password_hash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login Successful", user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
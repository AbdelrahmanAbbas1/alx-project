const pool = require('../../config/db');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

dotenv.config();
// Register a new user

exports.registerUser = async (req, res) => {
  const { user_name, user_email, password_hash } = req.body;

  if (!user_name || !user_email || !password_hash) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Authentication process
    const hashed_password = await bcrypt.hash(password_hash, saltRounds);
    
    // Adding data to the database
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
const secretKey = process.env.JWT_SECRET_KEY;

exports.loginUser = async (req, res) => {
  const { user_email, password_hash } = req.body;

  if (!user_email || !password_hash) {
    res.status(400).json({ message: "All fields are required" });
  }


  try {
    const [rows] = await pool.query(
      'SELECT * FROM users where user_email = ?',
      user_email
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password_hash, user.password_hash);

    // Verifying the password
    if (!isPasswordCorrect) {
      console.log('Invalid Password');
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Generating a jwt token
    const payload = { user_id: user.user_id, user_name: user.user_name };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Storing the token in a cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'Production',
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(200).json({ message: "Login Successful", token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};


// Getting all users
exports.allUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users'
    );
    res.status(200).json({ message: "Data received", users: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
}

exports.logoutUser = async (req, res) => {
  // Clear the cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "Production",
  });
  res.status(200).json({ message: "logut successful" });
};
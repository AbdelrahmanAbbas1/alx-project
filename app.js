const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config()

const app = express();

app.get('/', (req, res) => {
  res.send('API is working');
})

app.listen(3000, () => console.log('Server is running on port 3000'));

db.query('SELECT * FROM users')
  .then(() => console.log('DATABASE connected.....'))
  .catch((err) => console.error('DATABASE connection failed:', err));
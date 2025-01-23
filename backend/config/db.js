const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');


const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

console.log('Database Connection Details:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
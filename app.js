const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const userRouter = require('./src/routes/users')

// Loading environment variables
dotenv.config()

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('API is working');
});

app.use('/users', userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

// db.query('SELECT * FROM users')
//   .then(() => console.log('DATABASE connected.....'))
//   .catch((err) => console.error('DATABASE connection failed:', err));
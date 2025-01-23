const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const userRouter = require('./src/routes/users');
const quizRouter = require('./src/routes/quizzes');

// Loading environment variables
dotenv.config();

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('API is working');
});

// Users route
app.use('/api/users', userRouter);

// Quizzes route
app.use('/api/quizzes', quizRouter);

const port = process.env.PORT || 5000;

// Conditionally start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

module.exports = app; // Export the app for testing
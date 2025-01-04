const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const userRouter = require('./src/routes/users');

// Loading environment variables
dotenv.config()

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Middlewares
app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '..', 'frontend')));


app.get('/', (req, res) => {
  res.send('API is working');
});

app.use('/api/users', userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
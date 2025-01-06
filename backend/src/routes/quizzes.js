const express = require('express');
const router = express.Router();
const { createQuiz } = require('../controllers/quizController');
const { verifyToken } = require('../middlewares/authMiddleware');
// Register User

router.post('/create', verifyToken, createQuiz);

module.exports = router;
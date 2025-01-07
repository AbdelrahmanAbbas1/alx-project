const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const resultController = require('../controllers/resultController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/create', verifyToken, quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:quizId', quizController.getQuizById);
router.post('/submit', verifyToken, quizController.submitQuizResponses);
router.get('/results/:userId', verifyToken, resultController.getUserResults);

module.exports = router;
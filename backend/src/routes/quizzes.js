const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const resultController = require('../controllers/resultController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/create', verifyToken, quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:quiz_id', quizController.getQuizById);
router.post('/submit', verifyToken, quizController.submitQuizResponses);
router.get('/results/:user_id', verifyToken, resultController.getUserResults);

module.exports = router;
const pool = require('../../config/db');
const dotenv = require('dotenv');

// Loading the environmental variables
dotenv.config();

exports.createQuiz = async (req, res) => {
  const {title, description, questions} = req.body;

  if (!title || !description || !questions || !Array.isArray(questions)) {
    res.status(401).json({ message: "All fields are required" });
  }
  
  try {
    const [quiz] = await pool.query(
      'INSERT INTO quizzes (title, description) VALUES (?, ?)',
      [title, description]
    );

    const quizId = quiz.insertId;

    for (const question of questions) {
      const { question_text, options, correct_option } = question;
      const [que] = await pool.query(
        'INSERT INTO questions (quiz_id, question_text, option_1, option_2, option_3, option_4 ,correct_option)',
        [quizId, question_text, ...options, correct_option]
      );
    }
    res.status(201).json({ message: "Quiz created Successfully", quizId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create the quiz" });
  }
}
const pool = require('../../config/db');
const dotenv = require('dotenv');

// Loading the environmental variables
dotenv.config();

exports.createQuiz = async (req, res) => {
  const {title, description, questions} = req.body;

  if (!title || !description || !questions || !Array.isArray(questions)) {
    return res.status(401).json({ message: "All fields are required" });
  }
  
  try {
    const [quiz] = await pool.query(
      'INSERT INTO quizzes (title, description) VALUES (?, ?)',
      [title, description]
    );

    const quizId = quiz.insertId;

    for (const question of questions) {
      const { question_text, options, correct_option } = question;
      
      // Validate the question structure
      if (
        !question_text ||
        !options ||
        !Array.isArray(options) ||
        options.length !== 4 || // Ensure exactly 4 options
        !correct_option ||
        correct_option < 1 ||
        correct_option > 4 // Ensure correct_option is between 1 and 4
      ) {
        return res.status(400).json({ message: "Invalid question format. Ensure each question has valid text, 4 options, and a correct option between 1 and 4." });
      }
      
      await pool.query(
        'INSERT INTO questions (quiz_id, question_text, option_1, option_2, option_3, option_4 ,correct_option)',
        [quizId, question_text, ...options, correct_option]
      );
    }
    return res.status(201).json({ message: "Quiz created Successfully", quizId });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create the quiz" });
  }
}
const pool = require('../../config/db');
const dotenv = require('dotenv');

// Loading the environmental variables
dotenv.config();

exports.createQuiz = async (req, res) => {
  const { title, description, questions, created_by } = req.body;

  if (!title || !description || !questions || !Array.isArray(questions) || !created_by) {
    return res.status(401).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [created_by]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [quiz] = await pool.query(
      'INSERT INTO quizzes (title, description, created_by) VALUES (?, ?, ?)',
      [title, description, created_by]
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
        'INSERT INTO questions (quiz_id, question_text, option_1, option_2, option_3, option_4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [quizId, question_text, ...options, correct_option]
      );
    }

    return res.status(201).json({ message: "Quiz created successfully", quizId });
  } catch (err) {
    console.error("Error creating quiz:", err);
    return res.status(500).json({ error: "Failed to create the quiz", details: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const [quizzes] = await pool.query('SELECT * FROM quizzes');
    res.status(200).json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  const { quizId } = req.params;
  try {
    const [quiz] = await pool.query('SELECT * FROM quizzes WHERE quiz_id = ?', [quizId]);
    if (quiz.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const [questions] = await pool.query('SELECT * FROM questions WHERE quiz_id = ?', [quizId]);
    res.status(200).json({ quiz: quiz[0], questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve quiz" });
  }
};

exports.submitQuizResponses = async (req, res) => {
  const { userId, quizId, responses } = req.body;

  if (!userId || !quizId || !responses || !Array.isArray(responses)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let score = 0;
    for (const response of responses) {
      const { questionId, selectedOption } = response;
      const [question] = await pool.query('SELECT correct_option FROM questions WHERE question_id = ?', [questionId]);
      if (question.length > 0 && question[0].correct_option === selectedOption) {
        score++;
      }
    }

    await pool.query('INSERT INTO results (score, user_id, quiz_id) VALUES (?, ?, ?)', [score, userId, quizId]);
    res.status(201).json({ message: "Quiz submitted successfully", score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz responses" });
  }
};
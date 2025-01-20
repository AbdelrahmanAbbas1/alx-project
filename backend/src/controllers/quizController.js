const pool = require('../../config/db');
const dotenv = require('dotenv');

// Loading the environmental variables
dotenv.config();

exports.createQuiz = async (req, res) => {
  const { title, description, questions, created_by } = req.body;

  if (!title || !description || !questions || !Array.isArray(questions) || !created_by) {
    return res.status(401).json({ message: "All fields are required" });
  }

  // Check if quiz already exists
  const [existingQuiz] = await pool.query('SELECT * FROM quizzes WHERE title = ?', [title]);
  if (existingQuiz.length > 0) {
    console.log(existingQuiz[0].quiz_id);
    return res.status(409).json({ message: "Quiz already exists", quiz_id: existingQuiz[0].quiz_id });
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

    const quiz_id = quiz.insertId;

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
        [quiz_id, question_text, ...options, correct_option]
      );
    }

    return res.status(201).json({ message: "Quiz created successfully", quiz_id });
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
  const { quiz_id } = req.params;
  try {
    console.log("Quiz ID IN CONTROLLER: ", quiz_id);
    const [quiz] = await pool.query('SELECT * FROM quizzes WHERE quiz_id = ?', [quiz_id]);
    console.log(quiz);
    if (quiz.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const [questions] = await pool.query('SELECT * FROM questions WHERE quiz_id = ?', [quiz_id]);
    res.status(200).json({ quiz: quiz[0], questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve quiz" });
  }
};

exports.submitQuizResponses = async (req, res) => {
  const { user_id, quiz_id, responses } = req.body;

  if (!user_id || !quiz_id || !responses || !Array.isArray(responses)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let score = 0;
    for (const response of responses) {
      const { question_id, selected_option } = response;
      const [question] = await pool.query('SELECT correct_option FROM questions WHERE question_id = ?', [question_id]);
      if (question.length > 0 && question[0].correct_option === selected_option) {
        score++;
      }
    }

    await pool.query('INSERT INTO results (score, user_id, quiz_id) VALUES (?, ?, ?)', [score, user_id, quiz_id]);
    res.status(201).json({ message: "Quiz submitted successfully", score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz responses" });
  }
};
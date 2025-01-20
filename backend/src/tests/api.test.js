const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');
const dotenv = require('dotenv');

dotenv.config();

describe('API Endpoints', () => {
  let token;
  let user_id;
  let quiz_id;

  beforeAll(async () => {
    // Register a user
    await request(app)
      .post('/api/users/register')
      .send({ user_name: 'testuser', user_email: 'testuser@example.com', password_hash: 'password' });

    // Login the user to get a token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({ user_email: 'testuser@example.com', password_hash: 'password' });

    console.log(loginResponse.body); // dubugging
    token = loginResponse.body.token;
    user_id = loginResponse.body.user_id;
    console.log("user_id: ", user_id); // debugging
  });

  afterAll(async () => {
    // Close the database connection pool
    try {
      // Clean up the specific entries created during the test
      console.log(quiz_id); // debugging
      if (quiz_id) {
        await pool.query('DELETE FROM results WHERE quiz_id = ?', [quiz_id]);
        await pool.query('DELETE FROM questions WHERE quiz_id = ?', [quiz_id]);
        await pool.query('DELETE FROM quizzes WHERE quiz_id = ?', [quiz_id]);
      }
      if (user_id) {
        await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]);
      }
    } catch (error) {
      console.error('Error in afterAll:', error);
    } finally {
      await pool.end(); // Close the database connection
    }
  });

  it('should create a new quiz', async () => {
    const response = await request(app)
      .post('/api/quizzes/create')
      .set('Cookie', `authToken=${token}`)
      .send({
        title: 'Test Quiz',
        description: 'This is a test quiz',
        created_by: user_id,
        questions: [
          {
            question_text: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            correct_option: 4
          }
        ]
      });
      console.log("user_id: ", user_id); // debugging
      console.log("TOKEN: ", token); // debugging
      console.log(response.body);
      console.log(response.body.quiz_id);
      if (response.body.message === "Quiz already exists") {
        quiz_id = response.body.quiz_id;
      }
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Quiz created successfully');
      quiz_id = response.body.quiz_id;
  });

  it('should get all quizzes', async () => {
    const response = await request(app).get('/api/quizzes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a quiz by ID', async () => {
    console.log("quiz_id: ", quiz_id);
    const response = await request(app).get(`/api/quizzes/${quiz_id}`);
    expect(response.status).toBe(200);
    expect(response.body.quiz).toHaveProperty('title', 'Test Quiz');
  });

  it('should submit quiz responses', async () => {
    const response = await request(app)
      .post('/api/quizzes/submit')
      .set('Cookie', `authToken=${token}`)
      .send({
        user_id,
        quiz_id,
        responses: [
          {
            question_id: 1,
            selected_option: 4
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Quiz submitted successfully');
  });

  it('should get user results', async () => {
    const response = await request(app)
      .get(`/api/quizzes/results/${user_id}`)
      .set('Cookie', `authToken=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
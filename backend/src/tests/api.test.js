const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');
const dotenv = require('dotenv');

dotenv.config();

describe('API Endpoints', () => {
  let token;
  let userId;
  let quizId;

  beforeAll(async () => {
    // Register a user
    await request(app)
      .post('/api/users/register')
      .send({ user_name: 'testuser', user_email: 'testuser@example.com', password_hash: 'password' });

    // Login the user to get a token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({ user_email: 'testuser@example.com', password_hash: 'password' });

    token = loginResponse.body.token;
    userId = loginResponse.body.userId;
  });

  afterAll(async () => {
    // Close the database connection pool
    await pool.end();
  });

  it('should create a new quiz', async () => {
    const response = await request(app)
      .post('/api/quizzes/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Quiz',
        description: 'This is a test quiz',
        created_by: userId,
        questions: [
          {
            question_text: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            correct_option: 4
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Quiz created successfully');
    quizId = response.body.quizId;
  });

  it('should get all quizzes', async () => {
    const response = await request(app).get('/api/quizzes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a quiz by ID', async () => {
    const response = await request(app).get(`/api/quizzes/${quizId}`);
    expect(response.status).toBe(200);
    expect(response.body.quiz).toHaveProperty('title', 'Test Quiz');
  });

  it('should submit quiz responses', async () => {
    const response = await request(app)
      .post('/api/quizzes/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        quizId,
        responses: [
          {
            questionId: 1,
            selectedOption: 4
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Quiz submitted successfully');
    expect(response.body).toHaveProperty('score', 1);
  });

  it('should get user results', async () => {
    const response = await request(app)
      .get(`/api/quizzes/results/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('score', 1);
  });
});
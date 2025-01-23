# Quiz Web App

A web application for creating and taking quizzes.

## Development Environment

### Prerequisites

- Node.js (v14 or higher)
- MySQL

### Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone https://github.com/AbdelrahmanAbbas1/quiz_wep_app.git
   cd quiz_wep_app
   ```

2. **Install dependencies:**

   Navigate to the backend directory and install the dependencies:
   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add the following:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   ```

4. **Set up the database:**

   Ensure your MySQL server is running and execute the SQL script to create the necessary database and tables.

5. **Start the development server:**

   ```sh
   npm start
   ```

6. **Run tests:**

   ```sh
   npm test
   ```

## Usage Guidelines

1. **Access the application:**
   Open your web browser and navigate to `http://localhost:5000`.

2. **Register a new user:**
   Send a POST request to `/api/users/register` with the user's details.

3. **Login a user:**
   Send a POST request to `/api/users/login` with the user's credentials.

4. **Create a new quiz:**
   Send a POST request to `/api/quizzes/create` with the quiz details (requires authentication).

5. **Get all quizzes:**
   Send a GET request to `/api/quizzes`.

6. **Get a quiz by ID:**
   Send a GET request to `/api/quizzes/:quiz_id`.

7. **Submit quiz responses:**
   Send a POST request to `/api/quizzes/submit` with the user's responses (requires authentication).

8. **Get user results:**
   Send a GET request to `/api/quizzes/results/:user_id` (requires authentication).

## Project Architecture

### Folder Structure

```
quiz_web_app/
├── src/
│   ├── controllers/    # Handles the logic for different routes
│   ├── models/         # Defines the database schemas
│   ├── routes/         # Defines the application routes
│   └── ...             # Other directories and files
├── tests/              # Contains test cases
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

### Required Packages

The following packages are required for this project:

- express
- body-parser
- cors
- cookie-parser
- dotenv
- mysql2
- bcrypt
- jsonwebtoken
- supertest
- jest

These packages are already listed in the `package.json` file and will be installed when you run `npm install`.

## API Documentation

### User Endpoints

#### Register a new user
- **URL:** `/api/users/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "user_name": "string",
    "user_email": "string",
    "password_hash": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user_id": "number"
  }
  ```

#### Login a user
- **URL:** `/api/users/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "user_email": "string",
    "password_hash": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User logged in successfully",
    "user_id": "number",
    "token": "string"
  }
  ```

#### Get all users
- **URL:** `/api/users/all`
- **Method:** `GET`
- **Headers:**
 ```json
  {
    "Cookie": "authToken=<token>"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Data received",
    "users": [
      {
        "user_id": "number",
        "user_name": "stirng",
        "user_email": "stirng",
        "created_at": "date"
      }
    ]
  }
  ```
  #### Logout a user
- **URL:** `/api/users/logout`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Cookie": "authToken=<token>"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Logout Successfully"
  }
  ```

### Quiz Endpoints

#### Create a new quiz
- **URL:** `/api/quizzes/create`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Cookie": "authToken=<token>"
  }
  ```
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "questions": [
      {
        "question_text": "string",
        "options": ["string", "string", "string", "string"],
        "correct_option": "string"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Quiz created successfully",
    "quiz_id": "number"
  }
  ```

#### Get all quizzes
- **URL:** `/api/quizzes`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "quiz_id": "number",
      "title": "string",
      "description": "string",
      "created_at": "date",
      "created_by": "number"
    }
  ]
  ```

#### Get a quiz by ID
- **URL:** `/api/quizzes/:quiz_id`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "quiz": {
      "quiz_id": "number",
      "title": "string",
      "description": "string",
      "created_at": "date",
      "created_by": "number"
    },
      "questions": [
        {
        "question_id": "number",
        "question_text": "string",
        "option_1": "string",
        "option_2": "string",
        "option_3": "string",
        "option_4": "string",
       "correct_option": "number",
        "created_at": "date",
        "quiz_id": "number"
        }
    ]
  }
  ```

#### Submit quiz responses
- **URL:** `/api/quizzes/submit`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Cookie": "authToken=<token>"
  }
  ```
- **Body:**
  ```json
  {
    "user_id": "number",
    "quiz_id": "number",
    "responses": [
      {
        "question_id": "number",
        "selected_option": "number"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Quiz submitted successfully",
    "user_id": "number",
    "score": "number"
  }
  ```

#### Get user results
- **URL:** `/api/quizzes/results/:user_id`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "Cookie": "authToken=<token>"
  }
  ```
- **Response:**
  ```json
  [
    {
      "result_id": "number",
      "score": "number",
      "taken_at": "date",
      "user_id": "number",
      "quiz_id": "number"
    }
  ]
  ```

### Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request


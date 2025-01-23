# Quiz Web App

A web application for creating and taking quizzes.

## Development Environment

### Prerequisites

- Node.js (v14 or higher)
- MySQL

### Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
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

### Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request
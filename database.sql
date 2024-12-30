CREATE DATABASE quiz_app_db;
USE quiz_app_db;

CREATE TABLE users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE quizzes (
	quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) UNIQUE NOT NULL,
    description text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE questions (
	question_id INT PRIMARY KEY AUTO_INCREMENT,
    question_text text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quiz_id INT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id)
);

CREATE TABLE options (
	option_id INT PRIMARY KEY AUTO_INCREMENT,
    option_text text NOT NULL,
    is_correct BOOLEAN,
    question_id INT,
    quiz_id INT,
	FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE user_response (
	response_id INT PRIMARY KEY AUTO_INCREMENT,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    option_id INT,
    user_id INT,
    question_id INT,
    FOREIGN KEY (option_id) REFERENCES options(option_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE results (
	result_id INT PRIMARY KEY AUTO_INCREMENT,
    score INT NOT NULL,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    quiz_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id)
);
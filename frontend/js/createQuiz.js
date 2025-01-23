import jwtDecode from 'jwt-decode';

let questionCount = 1;

function addQuestion() {
    questionCount++;
    const questionsContainer = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `
        <label for="question_text_${questionCount}">Question ${questionCount}:</label>
        <input type="text" id="question_text_${questionCount}" name="question_text_${questionCount}" required>
        <label for="option_1_${questionCount}">Option 1:</label>
        <input type="text" id="option_1_${questionCount}" name="option_1_${questionCount}" required>
        <label for="option_2_${questionCount}">Option 2:</label>
        <input type="text" id="option_2_${questionCount}" name="option_2_${questionCount}" required>
        <label for="option_3_${questionCount}">Option 3:</label>
        <input type="text" id="option_3_${questionCount}" name="option_3_${questionCount}" required>
        <label for="option_4_${questionCount}">Option 4:</label>
        <input type="text" id="option_4_${questionCount}" name="option_4_${questionCount}" required>
        <label for="correct_option_${questionCount}">Correct Option:</label>
        <input type="number" id="correct_option_${questionCount}" name="correct_option_${questionCount}" min="1" max="4" required>
    `;
    questionsContainer.appendChild(questionDiv);
}

document.getElementById('createQuizForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const questions = [];

    for (let i = 1; i <= questionCount; i++) {
        const question_text = document.getElementById(`question_text_${i}`).value;
        const options = [
            document.getElementById(`option_1_${i}`).value,
            document.getElementById(`option_2_${i}`).value,
            document.getElementById(`option_3_${i}`).value,
            document.getElementById(`option_4_${i}`).value
        ];
        const correct_option = parseInt(document.getElementById(`correct_option_${i}`).value);

        questions.push({ question_text, options, correct_option });
    }

    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.user_id; // Extract the user ID from the decoded token

    const response = await fetch('/api/quizzes/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `authToken=${token}` // Use Authorization header for token
        },
        body: JSON.stringify({ title, description, questions, created_by: user_id })
    });

    const result = await response.json();
    if (response.ok) {
        alert('Quiz created successfully!');
        window.location.href = 'quizzes.html';
    } else {
        alert(result.message);
    }
});
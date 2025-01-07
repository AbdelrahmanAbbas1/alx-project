document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');

    const response = await fetch(`/api/quizzes/${quizId}`);
    const data = await response.json();

    document.getElementById('quizTitle').innerText = data.quiz.title;

    const quizForm = document.getElementById('quizForm');
    data.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
            <h4>${index + 1}. ${question.question_text}</h4>
            <input type="radio" name="question${question.question_id}" value="1"> ${question.option_1}<br>
            <input type="radio" name="question${question.question_id}" value="2"> ${question.option_2}<br>
            <input type="radio" name="question${question.question_id}" value="3"> ${question.option_3}<br>
            <input type="radio" name="question${question.question_id}" value="4"> ${question.option_4}<br>
        `;
        quizForm.appendChild(questionDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Submit';
    quizForm.appendChild(submitButton);

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const responses = [];
        data.questions.forEach(question => {
            const selectedOption = document.querySelector(`input[name="question${question.question_id}"]:checked`);
            if (selectedOption) {
                responses.push({
                    questionId: question.question_id,
                    selectedOption: parseInt(selectedOption.value)
                });
            }
        });

        const token = localStorage.getItem('token');
        const response = await fetch('/api/quizzes/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: 1, quizId, responses }) // Replace userId with the actual user ID
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Quiz submitted successfully! Your score: ${result.score}`);
        } else {
            alert(result.message);
        }
    });
});
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quiz_id = urlParams.get('quiz_id');

    const response = await fetch(`/api/quizzes/${quiz_id}`);
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
            const selected_option = document.querySelector(`input[name="question${question.question_id}"]:checked`);
            if (selected_option) {
                responses.push({
                    question_id: question.question_id,
                    selected_option: parseInt(selected_option.value)
                });
            }
        });

        const token = localStorage.getItem('token');
        const response = await fetch('/api/quizzes/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `authToken=${token}`
            },
            body: JSON.stringify({ user_id: 1, quiz_id, responses }) // Replace user_id with the actual user ID
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Quiz submitted successfully! Your score: ${result.score}`);
        } else {
            alert(result.message);
        }
    });
});
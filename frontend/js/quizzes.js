document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/quizzes');
    const quizzes = await response.json();

    const quizzesList = document.getElementById('quizzesList');
    quizzes.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.description}</p>
            <button onclick="window.location.href='quiz.html?quizId=${quiz.quiz_id}'">Take Quiz</button>
        `;
        quizzesList.appendChild(quizItem);
    });
});
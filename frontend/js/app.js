import { loginUser, registerUser } from './auth.js';

// Handle login form submission
// Check if the login form exists before adding the event listener
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loginUser(email, password); // Call login function
    });
}

// Handle registration form submission
// Check if the registration form exists before adding the event listener
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    registerUser(name, email, password); // Call register function
    });
}
  
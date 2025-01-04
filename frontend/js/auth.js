// Login Function
export async function loginUser(email, password) {
  try {
      const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: email, password_hash: password }),
      });

      const data = await response.json();

      if (response.ok) {
          localStorage.setItem('authToken', data.token); // Store JWT in localStorage
          window.location.href = 'quizzes.html'; // Redirect to quizzes page
      } else {
          alert('Error: ' + data.error);
      }
  } catch (error) {
      console.error('Error logging in:', error);
  }
}

// Register Function
export async function registerUser(name, email, password) {
  try {
      const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_name: name, user_email: email, password_hash: password }),
      });

      const data = await response.json();

      if (response.ok) {
          alert('Registration successful!');
          window.location.href = 'login.html'; // Redirect to login page
      } else {
          alert('Error: ' + data.error);
      }
  } catch (error) {
      console.error('Error registering user:', error);
  }
}
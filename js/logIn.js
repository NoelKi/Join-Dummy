function changeToSignUp() {
  window.location.href = '../pages/signUp.html';
}

async function fetchUsers() {
  try {
    const response = await fetch(`${BASE_URL}users.json`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

async function checkLogInData(email, password) {
  const users = await fetchUsers();
  if (!users) {
    return false;
  }
  for (const key in users) {
    const user = users[key];
    if (user.email === email && user.password === password) {
      return true;
    }
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  loginButton.addEventListener('click', async event => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (await checkLogInData(email, password)) {
      window.location.href = 'login.html';
    } else {
      alert('Login failed: Incorrect email or password');
    }
  });
});
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
      saveUserIdLocalStorage(key);
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
      window.location.href = 'index.html';
    } else {
      alert('Login failed: Incorrect email or password');
    }
  });
});

function saveUserIdLocalStorage(id) {
  const idAsText = JSON.stringify(id);
  localStorage.setItem('userId', idAsText);
}

function loadUserIdLocalStorage() {
  const idAsText = localStorage.getItem('userId');
  if (!idAsText) return window.location.href = 'login.html';
  userId = JSON.parse(idAsText);
}

function toggleCheckBox() {
  let image = document.getElementById('checkBoxRemember');
  image.src = image.src.includes('rememberDefault') ? '../assets/img/rememberChecked.svg' : '../assets/img/rememberDefault.svg';
}

function changeToSignUp() {
  window.location.href = '../pages/signUp.html';
}

function fetchUsers(options = {}) {
  return fetch(`${BASE_URL}users.json`, options)
    .then(response => response.json());
}

async function checkLogInData(email, password) {
  const users = await fetchUsers();
  if (!users) {
    return false;
  }
  for (const key in users) {
    const user = users[key];
    if (user.email === email && user.password === password) {
      saveUserIdLocalStorage(key, user.name);
      return true;
    }
  }
  return false;
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (await checkLogInData(email, password)) {
    window.location.href = 'index.html';
  } else {
    alert('Login failed: Incorrect email or password');
  }
  getUserLists();
}

function saveUserIdLocalStorage(id, name) {
  const idAsText = JSON.stringify(id);
  const nameAsText = JSON.stringify(name);
  localStorage.setItem('userId', idAsText);
  localStorage.setItem('userName', nameAsText);
}

function loadUserIdLocalStorage() {
  const idAsText = localStorage.getItem('userId');
  if (!idAsText) return window.location.href = 'login.html';
  return JSON.parse(idAsText);
}

function toggleCheckBox() {
  let image = document.getElementById('checkbox-remember');
  image.src = image.src.includes('rememberDefault') ? '../assets/img/rememberChecked.svg' : '../assets/img/rememberDefault.svg';
}

function changeToSignUp() {
  window.location.href = '../pages/signUp.html';
}

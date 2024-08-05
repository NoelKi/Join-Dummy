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
    showLoadingScreen(() => window.location.href = 'index.html');
  } else {
    alert('Login failed: Incorrect email or password');
  }
}


async function guestLogin() {
  await guestUser();
  showLoadingScreen(() => window.location.href = 'index.html');
}


function getGreeting() {
  const currentTime = new Date().getHours();
  if (currentTime < 12) {
    return "Good morning";
  } else if (currentTime < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}


function showLoadingScreen(callback) {
  updateGreetingMessage();
  displayLoadingScreens();

  setTimeout(() => {
    hideLoadingScreens();
    if (callback) callback();
  }, 2000);
}


function displayLoadingScreens() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingScreenSummary = document.getElementById('loading-screen-summary');
  const mainContent = document.getElementById('main-content');

  loadingScreen.style.display = 'flex';
  loadingScreenSummary.style.display = 'flex';
  mainContent.style.display = 'none';
}


function hideLoadingScreens() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingScreenSummary = document.getElementById('loading-screen-summary');

  loadingScreen.style.display = 'none';
  loadingScreenSummary.style.display = 'none';
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


function updateGreetingMessage() {
  const userName = JSON.parse(localStorage.getItem('userName')) || "Guest";
  const greeting = getGreeting();
  if (userName === "Guest") {
    document.getElementById('greetingLoading').innerHTML = `${greeting}`;
  } else {
    document.getElementById('greetingLoading').innerHTML = `${greeting}, &nbsp; <span>${capitalizeFirstLetter(userName)}</span>`;
  }
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


async function guestUser() {
  const guestEmail = "guest@example.com";
  const users = await fetchUsers();

  for (const key in users) {
    const user = users[key];
    if (user.email === guestEmail) {
      saveUserIdLocalStorage(key, user.name);
      return;
    }
  }
  console.error("Guest user not found in Firebase");
}


function changeToSignUp() {
  window.location.href = '../pages/signUp.html';
}
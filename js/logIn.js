/**
 * Initializes the password inputs by adding event listeners.
 * This function calls `initializePasswordInputs` to set up event listeners on the password input fields.
 * @function initi
 */
function initi() {
  initializePasswordInputs();
}


/**
 * Fetches the user data from the server.
 * This function fetches the user data from the server using the provided options and returns the data as a JSON object.
 * @function fetchUsers
 * @param {Object} [options={}] - Optional fetch options.
 * @returns {Promise<Object>} The user data.
 */
function fetchUsers(options = {}) {
  return fetch(`${BASE_URL}users.json`, options)
    .then(response => response.json());
}


/**
 * Checks the login data against the stored user data.
 * This function checks the provided email and password against the stored user data.
 * If a match is found, it saves the user ID and name to localStorage.
 * @async
 * @function checkLogInData
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} True if the login data is correct, otherwise false.
 */
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


/**
 * Handles the login process.
 * This function retrieves the email and password from the input fields,
 * checks them against the stored user data, and redirects to the main page if successful.
 * Otherwise, it shows an error message below the respective input fields.
 * @async
 * @function login
 */
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Clear previous error messages
  document.getElementById('email-error').innerText = '';
  document.getElementById('password-error').innerText = '';

  // Check login data
  const loginValid = await checkLogInData(email, password);

  if (loginValid) {
    showLoadingScreen(() => window.location.href = 'index.html');
  } else {
    if (!email) {
      document.getElementById('email-error').innerText = 'Email is required';
    }
    if (!password) {
      document.getElementById('password-error').innerText = 'Password is required';
    } else {
      document.getElementById('email-error').innerText = 'Incorrect email or password';
      document.getElementById('password-error').innerText = 'Incorrect email or password';
    }
  }
}



/**
 * Handles the guest login process.
 * This function logs in as a guest user and redirects to the main page.
 * @async
 * @function guestLogin
 */
async function guestLogin() {
  await guestUser();
  showLoadingScreen(() => window.location.href = 'index.html');
}


/**
 * Returns an appropriate greeting based on the current time.
 * This function returns a greeting message based on the current time of day.
 * @function getGreeting
 * @returns {string} The greeting message.
 */
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


/**
 * Displays the loading screen and executes a callback after a delay.
 * This function displays a loading screen, waits for a short delay, and then executes the provided callback function.
 * @function showLoadingScreen
 * @param {Function} callback - The callback function to execute after the delay.
 */
function showLoadingScreen(callback) {
  updateGreetingMessage();
  displayLoadingScreens();
  setTimeout(() => {
    hideLoadingScreens();
    if (callback) callback();
  }, 2000);
}


/**
 * Displays the loading screens.
 * This function makes the loading screens visible and hides the main content.
 * @function displayLoadingScreens
 */
function displayLoadingScreens() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingScreenSummary = document.getElementById('loading-screen-summary');
  const mainContent = document.getElementById('main-content');
  loadingScreen.style.display = 'flex';
  loadingScreenSummary.style.display = 'flex';
  mainContent.style.display = 'none';
}


/**
 * Hides the loading screens.
 * This function hides the loading screens and shows the main content.
 * @function hideLoadingScreens
 */
function hideLoadingScreens() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingScreenSummary = document.getElementById('loading-screen-summary');
  loadingScreen.style.display = 'none';
  loadingScreenSummary.style.display = 'none';
}


/**
 * Capitalizes the first letter of each word in a name.
 * This function capitalizes the first letter of each word in the provided name.
 * @function capitalizeName
 * @param {string} name - The name to capitalize.
 * @returns {string} The capitalized name.
 */
function capitalizeName(name) {
  return name.split(' ').map(capitalizeFirstLetter).join(' ');
}


/**
 * Capitalizes the first letter of a string.
 * This function capitalizes the first letter of the provided string and converts the rest of the string to lowercase.
 * @function capitalizeFirstLetter
 * @param {string} string - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


/**
 * Updates the greeting message based on the user's name.
 * This function updates the greeting message with the user's name if available, or uses "Guest" otherwise.
 * @function updateGreetingMessage
 */
function updateGreetingMessage() {
  const userName = JSON.parse(localStorage.getItem('userName')) || "Guest";
  const greeting = getGreeting();
  if (userName === "Guest") {
    document.getElementById('greetingLoading').innerHTML = `${greeting}`;
  } else {
    document.getElementById('greetingLoading').innerHTML = `${greeting}, &nbsp; <span>${capitalizeName(userName)}</span>`;
  }
}


/**
 * Saves the user ID and name to localStorage.
 * This function saves the user ID and name to localStorage.
 * @function saveUserIdLocalStorage
 * @param {string} id - The user ID.
 * @param {string} name - The user name.
 */
function saveUserIdLocalStorage(id, name) {
  const idAsText = JSON.stringify(id);
  const nameAsText = JSON.stringify(name);
  localStorage.setItem('userId', idAsText);
  localStorage.setItem('userName', nameAsText);
}


/**
 * Loads the user ID from localStorage and redirects to login if not found.
 * This function loads the user ID from localStorage. If no user ID is found, it redirects to the login page.
 * @function loadUserIdLocalStorage
 * @returns {string} The user ID.
 */
function loadUserIdLocalStorage() {
  const idAsText = localStorage.getItem('userId');
  if (!idAsText) return window.location.href = 'login.html';
  return JSON.parse(idAsText);
}


/**
 * Toggles the checkbox image between checked and unchecked states.
 * This function toggles the checkbox image between the checked and unchecked states.
 * @function toggleCheckBox
 */
function toggleCheckBox() {
  let image = document.getElementById('checkbox-remember');
  image.src = image.src.includes('rememberDefault') ? '../assets/img/rememberChecked.svg' : '../assets/img/rememberDefault.svg';
}


/**
 * Handles the guest user login process.
 * This function logs in as a guest user by looking for the guest email in the user database.
 * If the guest user is found, it saves the user ID and name to localStorage.

 * @async
 * @function guestUser
 */
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


/**
 * Initializes the password input fields by adding event listeners.
 * This function sets up event listeners on the password input fields to handle input events and toggle visibility.
 * @function initializePasswordInputs
 */
function initializePasswordInputs() {
  const passwordInputs = document.querySelectorAll('.input-wrapper input[type="password"]');
  passwordInputs.forEach(input => {
    const passwordIcon = input.nextElementSibling;
    const toggleVisibilityIcon = passwordIcon.nextElementSibling;
    input.addEventListener('input', () => handlePasswordInput(input, passwordIcon, toggleVisibilityIcon));
    toggleVisibilityIcon.addEventListener('click', () => togglePasswordVisibility(input, toggleVisibilityIcon));
  });
}


/**
 * Handles the password input event to show or hide the visibility icon.
 * This function handles the input event on password fields, showing the appropriate icon based on the input value.
 * @function handlePasswordInput
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} passwordIcon - The password icon element.
 * @param {HTMLElement} toggleVisibilityIcon - The toggle visibility icon element.
 */
function handlePasswordInput(passwordInput, passwordIcon, toggleVisibilityIcon) {
  if (passwordInput.value.length > 0) {
    showVisibilityIcon(passwordIcon, toggleVisibilityIcon);
  } else {
    showPasswordIcon(passwordIcon, toggleVisibilityIcon);
  }
}


/**
 * Toggles the visibility of the password input field.
 * This function toggles the password input field between visible and hidden states.
 * @function togglePasswordVisibility
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} toggleVisibilityIcon - The toggle visibility icon element.
 */
function togglePasswordVisibility(passwordInput, toggleVisibilityIcon) {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  const iconSrc = type === 'password' ? '../assets/img/pw_visibility_off.svg' : '../assets/img/pw_visibility.svg';
  passwordInput.setAttribute('type', type);
  toggleVisibilityIcon.setAttribute('src', iconSrc);
}


/**
 * Shows the visibility icon and hides the password icon.
 * This function shows the visibility icon and hides the password icon.
 * @function showVisibilityIcon
 * @param {HTMLElement} passwordIcon - The password icon element.
 * @param {HTMLElement} toggleVisibilityIcon - The toggle visibility icon element.
 */
function showVisibilityIcon(passwordIcon, toggleVisibilityIcon) {
  passwordIcon.classList.add('hidden');
  toggleVisibilityIcon.classList.remove('hidden');
}


/**
 * Shows the password icon and hides the visibility icon.
 * This function shows the password icon and hides the visibility icon.
 * @function showPasswordIcon
 * @param {HTMLElement} passwordIcon - The password icon element.
 * @param {HTMLElement} toggleVisibilityIcon - The toggle visibility icon element.
 */
function showPasswordIcon(passwordIcon, toggleVisibilityIcon) {
  passwordIcon.classList.remove('hidden');
  toggleVisibilityIcon.classList.add('hidden');
}


/**
 * Redirects to the sign-up page.
 * This function redirects the user to the sign-up page.
 * @function changeToSignUp
 */
function changeToSignUp() {
  window.location.href = '../pages/signUp.html';
}
let isPolicyAccepted = false;

/**
 * Sends sign-up data to the server.
 *  * This function sends a POST request to the server with the user data. It handles
 * the conversion of the data to JSON format and checks the response status.
 * If the response is not OK, it throws an error.
 * @async
 * @function postSignUpData
 * @param {Object} data - The user data to be posted.
 * @param {string} data.name - The name of the user.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password of the user.
 * @param {string} data.id - The unique ID of the user.
 * @returns {Object} The response from the server.
 * @throws Will throw an error if the network response is not ok.
  */
async function postSignUpData(data) {
    try {
        const response = await fetch(`${BASE_URL}users.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error posting signup data:', error);
    }
}


/**
 * Handles the sign-up process by validating inputs, checking if the email already exists, and posting the user data.
 * This function orchestrates the sign-up process. It retrieves input values,
 * validates them, checks for email uniqueness, and posts the data to the server.
 * On success, it triggers a success message display.
 * @async
 * @function signUp
*/
async function signUp() {
    const { name, email, password, confirmPassword } = getInputValues();
    clearErrorMessages();
    const errors = validateInputs({ name, email, password, confirmPassword });
    if (errors.length > 0) {
        errors.forEach(({ field, message }) => showError(field, message));
        return;
    }
    if (await emailExists(email)) {
        showError('email', 'This email is already registered.');
        return;
    }
    const newUser = { name, email, password, id: Date.now().toString() };
    const result = await postSignUpData(newUser);
    if (result) showSuccessMessage();
}


/**
 * Retrieves the values from the input fields.
 * This function collects values from input fields with IDs 'name', 'email',
 * 'password', and 'confirm-password' and returns them in an object.
 * @function getInputValues
 * @returns {Object} An object containing the input values.
 */
function getInputValues() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value
    };
}


/**
 * Validates the user inputs.
 * This function checks if all required fields are filled, if the passwords match,
 * and if the email address is valid. It also ensures the privacy policy has been accepted.
 * @function validateInputs
 * @param {Object} inputs - The inputs to be validated.
 * @param {string} inputs.name - The name input.
 * @param {string} inputs.email - The email input.
 * @param {string} inputs.password - The password input.
 * @param {string} inputs.confirmPassword - The confirm password input.
 * @returns {Array} An array of error objects if validation fails, otherwise an empty array.
 */
function validateInputs({ name, email, password, confirmPassword }) {
    const errors = [];
    if (!isPolicyAccepted) errors.push({ field: 'policy', message: 'You must accept the privacy policy to sign up.' });
    if (!name || !email || !password || !confirmPassword) errors.push({ field: 'general', message: 'Please fill out all fields.' });
    if (password !== confirmPassword) errors.push({ field: 'confirm-password', message: 'Passwords do not match.' });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) errors.push({ field: 'email', message: 'Invalid email address.' });
    return errors;
}


/**
 * Checks if an email already exists in the user database.
 * This function fetches the list of users and checks if the provided email
 * is already registered. It returns a boolean indicating the presence of the email.
 * @async
 * @function emailExists
 * @param {string} email - The email to be checked.
 * @returns {boolean} True if the email exists, otherwise false.
 */
async function emailExists(email) {
    const users = await fetchUsers();
    return Object.values(users).some(user => user.email === email);
}


/**
 * Toggles the policy acceptance checkbox and enables/disables the sign-up button accordingly.
 * This function toggles the state of the privacy policy acceptance checkbox.
 * It updates the checkbox image and enables or disables the sign-up button
 * based on whether the policy is accepted.
 * @function toggleCheckBox
 */
function toggleCheckBox() {
    const checkBoxImage = document.getElementById('checkbox-remember');
    const signUpButton = document.getElementById('signup-button');
    isPolicyAccepted = !isPolicyAccepted;
    checkBoxImage.src = isPolicyAccepted ? '../assets/img/rememberChecked.svg' : '../assets/img/rememberDefault.svg';
    signUpButton.disabled = !isPolicyAccepted;
}


/**
 * Displays a success message and redirects to the login page after a delay.
 * This function shows a success message and an overlay for 2 seconds.
 * After that, it hides the success message and redirects the user to the login page.
 * @function showSuccessMessage
 */
function showSuccessMessage() {
    const successMessageElement = document.getElementById('success-message');
    const overlayElement = document.getElementById('overlay');
    if (successMessageElement && overlayElement) {
        successMessageElement.classList.remove('hidden');
        overlayElement.classList.remove('hidden');
        setTimeout(() => {
            successMessageElement.classList.add('hidden');
            overlayElement.classList.add('hidden');
            window.location.href = 'login.html';
        }, 2000);
    }
}


/**
 * Displays an error message below the specified input field.
 * This function displays an error message below the input field identified by
 * the 'field' parameter. The error message is shown by setting its text content
 * and making it visible.
 * @function showError
 * @param {string} field - The id of the input field.
 * @param {string} message - The error message to display.
 */
function showError(field, message) {
    const errorMessageElement = document.getElementById(`${field}-error-message`);
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('hidden');
    }
}


/**
 * Clears all error messages.
 * This function hides all error messages currently displayed on the page.
 * It targets elements with the class 'error-message' and adds the 'hidden' class
 * to them.
 * @function clearErrorMessages
 */
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.classList.add('hidden'));
}


/**
 * Redirects to the log-in page.
 * This function redirects the user to the log-in page.
 * @function changeToLogIn
 */
function changeToLogIn() {
    window.location.href = '../pages/login.html';
}
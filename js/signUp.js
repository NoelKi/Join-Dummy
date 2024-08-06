let isPolicyAccepted = false;

/**
 * Sends sign-up data to the server.
 * This function posts the user data to the server to register a new user.
 * It handles the network request and checks if the response is successful.
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
 * This function orchestrates the sign-up process. It retrieves input values, validates them,
 * checks if the email already exists in the database, and if all checks pass, posts the user data to the server.
 * It also handles displaying appropriate messages based on the outcomes.
 * @async
 * @function signUp
 */
async function signUp() {
    const { name, email, password, confirmPassword } = getInputValues();
    const error = validateInputs({ name, email, password, confirmPassword });
    if (error) return alert(error);
    if (await emailExists(email)) {
        return alert('This email is already registered.');
    }
    const newUser = { name, email, password, id: Date.now().toString() };
    const result = await postSignUpData(newUser);
    if (result) showSuccessMessage();
}


/**
 * Retrieves the values from the input fields.
 * This function retrieves the values from the sign-up form's input fields and returns them as an object.
 * @function getInputValues
 * @returns {Object} An object containing the input values.
 * @returns {string} name - The value of the name input field.
 * @returns {string} email - The value of the email input field.
 * @returns {string} password - The value of the password input field.
 * @returns {string} confirmPassword - The value of the confirm password input field.
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
 * This function validates the input values for the sign-up form.
 * It checks if all fields are filled, if the passwords match, if the email format is valid,
 * and if the privacy policy is accepted.
 * @function validateInputs
 * @param {Object} inputs - The inputs to be validated.
 * @param {string} inputs.name - The name input.
 * @param {string} inputs.email - The email input.
 * @param {string} inputs.password - The password input.
 * @param {string} inputs.confirmPassword - The confirm password input.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateInputs({ name, email, password, confirmPassword }) {
    if (!isPolicyAccepted) return 'You must accept the privacy policy to sign up.';
    if (!name || !email || !password || !confirmPassword) return 'Please fill out all fields.';
    if (password !== confirmPassword) return 'Passwords do not match.';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return 'Please enter a valid email address.';

    return null;
}


/**
 * Checks if an email already exists in the user database.
 * This function checks if the provided email is already registered in the user database.
 * It fetches the list of users and compares the email with those in the database.
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
 * It also enables or disables the sign-up button based on whether the policy is accepted.
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
 * This function displays a success message overlay when the sign-up process is successful.
 * It then redirects the user to the login page after a short delay.
 * @function showSuccessMessage
 */
function showSuccessMessage() {
    const successMessageElement = document.getElementById('success-message');
    const overlayElement = document.getElementById('overlay');

    if (successMessageElement && overlayElement) {
        successMessageElement.classList.toggle('hidden', false);
        overlayElement.classList.toggle('hidden', false);

        setTimeout(() => {
            successMessageElement.classList.toggle('hidden', true);
            overlayElement.classList.toggle('hidden', true);
            window.location.href = 'login.html';
        }, 2000);
    }
}
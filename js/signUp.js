let isPolicyAccepted = false;

/**
 * Sends sign-up data to the server.
 * @async
 * @function postSignUpData
 * @param {Object} data - The user data to be posted.
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
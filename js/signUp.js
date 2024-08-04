let isPolicyAccepted = false;

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


function getInputValues() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value
    };
}


function validateInputs({ name, email, password, confirmPassword }) {
    if (!isPolicyAccepted) return 'You must accept the privacy policy to sign up.';
    if (!name || !email || !password || !confirmPassword) return 'Please fill out all fields.';
    if (password !== confirmPassword) return 'Passwords do not match.';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return 'Please enter a valid email address.';

    return null;
}

async function signUp() {
    const { name, email, password, confirmPassword } = getInputValues();
    const error = validateInputs({ name, email, password, confirmPassword });

    if (error) return alert(error);

    const newUser = { name, email, password, id: Date.now().toString() };
    const result = await postSignUpData(newUser);

    if (result) showSuccessMessage();
}



function toggleCheckBox() {
    const checkBoxImage = document.getElementById('checkbox-remember');
    const signUpButton = document.getElementById('signup-button');

    isPolicyAccepted = !isPolicyAccepted;
    checkBoxImage.src = isPolicyAccepted ? '../assets/img/rememberChecked.svg' : '../assets/img/rememberDefault.svg';
    signUpButton.disabled = !isPolicyAccepted;
}


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
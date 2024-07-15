function backToLogIn() {
    window.location.href = "login.html";
}

async function postSignUpData(data) {
    try {
        const response = await fetch(`${BASE_URL}users.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting signup data:', error);
    }
}

async function signUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    if (!acceptTerms) {
       return alert('You must accept the privacy policy to sign up.');
    }
    if (password !== confirmPassword) {
       return alert('Passwords do not match.');
    }
    const newUser = {
        name,
        email,
        password,
        id: Date.now().toString()
    };
    const result = await postSignUpData(newUser);
    if (result) {
        alert('Sign up successful!');
        window.location.href = 'login.html';
    }
}



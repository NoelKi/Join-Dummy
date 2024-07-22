currentUserData = []; // local user data

BASE_URL = 'https://join-dummy-backend-default-rtdb.europe-west1.firebasedatabase.app/';

async function postData(path = "", data = {}) {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function getUserData() {
    // console.log(BASE_URL  + 'users/' + USER_ID  + ".json");
    try {
        const response = await fetch(BASE_URL  + 'users/' + USER_ID + ".json");
        if (!response.ok) {
            throw new Error('Netzwerk-Antwort war nicht ok');
        }
        const data = await response.json();
        console.log(data);
        currentUserData = data;
        return data;
    } catch (error) {
        console.error('Fehler:', error);
    }
}

async function deleteData(path = "", data = {}) {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    });
    return responseToJson = await response.json(); // parses JSON response into native JavaScript objects
}

async function putData(path = "", data = {}) {

    const response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    console.log(responseJson); // parses JSON response into native JavaScript objects
    return responseJson;
}

function updateUser(name,email,password,contacts,tasks) {
    putData(`/users/${USER_ID}`, {
        name: name,
        email: email,
        password: password,
        contacts: contacts,
        tasks: tasks
    });
}

let users = [
    {
        'id': 0,
        'name': 'Paul',
        'surname': 'Blau',
        'email': 'paul.blau@icloud.com',
        'password':'test123',
        'phoneNumber': '+05123249320448',
        'color':'salmon'
    },
    {
        'id': 1,
        'name': 'Hans',
        'surname': 'Gelb',
        'email': 'hans.gelb@icloud.com',
        'password':'test123',
        'phoneNumber': '+05123249320448',
        'color':'palegreen'
    },
    {
        'id': 2,
        'name': 'Achim',
        'surname': 'Rot',
        'email': 'achim.rot@icloud.com',
        'password':'test123',
        'phoneNumber': '+05123249320448',
        'color':'sandybrown'
    },
    {
        'id': 3,
        'name': 'Anette',
        'surname': 'Rot',
        'email': 'anette.rot@icloud.com',
        'password':'test123',
        'phoneNumber': '+05123249320448',
        'color':'indianred'
    },
    {
        'id': 4,
        'name': 'Johannes',
        'surname': 'Grün',
        'email': 'johannes.gruen@icloud.com',
        'password':'test123',
        'phoneNumber': '+05123249320448',
        'color':'aquamarine'
    },
]

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

async function getData(path = "") {
    try {
        const response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) {
            throw new Error('Netzwerk-Antwort war nicht ok');
        }
        const data = await response.json();
        console.log(data);
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

// Add a new user array to Firebase
function addUsers() {
    for (let i = 0; i < users.length; i++) {
        const e = users[i];
        postData(`/users`, {'name': `${e.name}`,
                                'surname': `${e.surname}`,
                                'id': `${e.id}`,
                                'email': `${e.email}`,'password': `${e.password}`,
                                'phoneNumber': `${e.phoneNumber}`,
                                'color': `${e.color}`,
                                'contacts': ``
                            });
    }
}

// Add a new user to Firebase
function addUser(id, name, surname, email, phoneNumber, password, color) {
    putData(`/user/${id}`,  {'name': `${name}`,
                            'surname': `${surname}`,
                            'id': `${id}`,
                            'email': `${email}`,'password': `${password}`,
                            'phoneNumber': `${phoneNumber}`,
                            'color': `${color}`,                            
                        });
                        
}

async function editSingleUser(id = 1, user = { name: 'Kieran' }) {
    putData(`users/${id}`, user);
}

async function getUser(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json;
}

const usersFirebase = getUser('/users');
console.log(usersFirebase);


let contacts = [
    {
        'id': 0,
        'name': 'Paul',
        'surname': 'Blau',
        'email': 'paul.blau@icloud.com',
        'phoneNumber': '+05123249320448',
        'color':'salmon'
    },
    {
        'id': 1,
        'name': 'Hans',
        'surname': 'Gelb',
        'email': 'hans.gelb@icloud.com',
        'phoneNumber': '+05123249320448',
        'color':'palegreen'
    },
    {
        'id': 2,
        'name': 'Achim',
        'surname': 'Rot',
        'email': 'achim.rot@icloud.com',
        'phoneNumber': '+05123249320448',
        'color':'sandybrown'
    },
    {
        'id': 3,
        'name': 'Anette',
        'surname': 'Rot',
        'email': 'anette.rot@icloud.com',
        'phoneNumber': '+05123249320448',
        'color':'indianred'
    },
    {
        'id': 4,
        'name': 'Johannes',
        'surname': 'Grün',
        'email': 'johannes.gruen@icloud.com',
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

postData(BASE_URL,contacts);
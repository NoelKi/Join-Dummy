// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyCblnxCjUgBTgsQKybrA9w3gSMg3cI4K8k",
//     authDomain: "join-dummy-backend.firebaseapp.com",
//     databaseURL: "https://join-dummy-backend-default-rtdb.europe-west1.firebasedatabase.app",
//     projectId: "join-dummy-backend",
//     storageBucket: "join-dummy-backend.appspot.com",
//     messagingSenderId: "789979684285",
//     appId: "1:789979684285:web:6662e811befca80d1686d4",
//     measurementId: "G-CG6DG5QFNT"
// };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// async function addData(name,surname,id,email,password) {
//     try {
//         await set(ref(db, 'users'), {
//             nameofuser: {name: name, surname: surname},
//             id: Number(id),
//             email: email,
//             password: password,
//         });
//         alert('Data Added Successfully');
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// async function retData() {
//     const dbRef = ref(db);
//     try {
//         const snapshot = await get(child(dbRef, 'EmployeeSet/' + id.value));
//         if (snapshot.exists()) {
//             FnameInp.value = snapshot.val().nameofemployee.firstname;
//             LnameInp.value = snapshot.val().nameofemployee.lastname;
//             DeptInp.value = snapshot.val().department;
//             swimId.value = snapshot.val().canswim ? "yes" : "no";
//         } else {
//             alert("Employee does not exist");
//         }
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// async function updateData() {
//     try {
//         await update(ref(db, 'EmployeeSet/' + cnicId.value), {
//             nameofemployee: { firstname: FnameInp.value, lastname: LnameInp.value },
//             department: DeptInp.value,
//             canswim: (swimId.value == "yes"),
//         });
//         alert('Data Updated Successfully');
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// async function deleteData() {
//     try {
//         await remove(ref(db, 'EmployeeSet/' + cnicId.value));
//         alert('Data Deleted Successfully');
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// let users = [
//     {
//         'id': 0,
//         'name': 'Paul',
//         'surname': 'Blau',
//         'email': 'paul.blau@icloud.com',
//         'password': 'test123',
//         'phoneNumber': '+05123249320448',
//         'color': 'salmon'
//     },
//     {
//         'id': 1,
//         'name': 'Hans',
//         'surname': 'Gelb',
//         'email': 'hans.gelb@icloud.com',
//         'password': 'test123',
//         'phoneNumber': '+05123249320448',
//         'color': 'palegreen'
//     },
//     {
//         'id': 2,
//         'name': 'Achim',
//         'surname': 'Rot',
//         'email': 'achim.rot@icloud.com',
//         'password': 'test123',
//         'phoneNumber': '+05123249320448',
//         'color': 'sandybrown'
//     },
//     {
//         'id': 3,
//         'name': 'Anette',
//         'surname': 'Rot',
//         'email': 'anette.rot@icloud.com',
//         'password': 'test123',
//         'phoneNumber': '+05123249320448',
//         'color': 'indianred'
//     },
//     {
//         'id': 4,
//         'name': 'Johannes',
//         'surname': 'Grün',
//         'email': 'johannes.gruen@icloud.com',
//         'password': 'test123',
//         'phoneNumber': '+05123249320448',
//         'color': 'aquamarine'
//     },
// ]

BASE_URL = 'https://join-dummy-backend-default-rtdb.europe-west1.firebasedatabase.app/';

async function postDataDevAk(path = "", data = {}) {
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

async function getDataDevAk(path = "") {
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

async function deleteDataDevAk(path = "", data = {}) {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    });
    return responseToJson = await response.json(); // parses JSON response into native JavaScript objects
}

async function putDataDevAk(path = "", data = {}) {

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

// Add a new user to Firestore
function addUsers() {
    for (let i = 0; i < users.length; i++) {
        const e = users[i];
        putDataDevAk(`/user/${e.id}`, {
            'name': `${e.name}`,
            'surname': `${e.surname}`,
            'id': `${e.id}`,
            'email': `${e.email}`, 'password': `${e.password}`,
            'phoneNumber': `${e.phoneNumber}`,
            'color': `${e.color}`
        });
    }
}

function addUser(id, name, surname, email, phoneNumber, password, color) {
    putDataDevAk(`/users`, {
        'name': `${name}`,
        'surname': `${surname}`,
        'id': `${id}`,
        'email': `${email}`, 'password': `${password}`,
        'phoneNumber': `${phoneNumber}`,
        'color': `${color}`
    });
}

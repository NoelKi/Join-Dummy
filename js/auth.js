USER_ID = '';

function loadUserIdLocalStorage() {
    const idAsText = localStorage.getItem('userId');
    if (!idAsText) return window.location.href = 'login.html';
    USER_ID = JSON.parse(idAsText);
}

loadUserIdLocalStorage();



// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// // import { getDatabase, ref, child, get, set, push, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
// // // TODO: Add SDKs for Firebase products that you want to use
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


// async function addData(name, surname, email, phoneNumber, color, contacts, tasks) {
//     try {
//         await set(ref(db, 'users/' + USER_ID), {
//             password: '123',
//             name: name,
//             email: email,
//             contacts: contacts,
//             tasks: tasks
//         });
//         alert('Data Added Successfully');
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// async function updateContacts(contacts) {
//     try {
//         await update(ref(db, 'users/' + USER_ID), {
//             contacts: contacts
//         });
//         alert('Data Updated Successfully');
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// // const postListRef = ref(db, 'posts');
// // const newPostRef = push(postListRef);
// // set(newPostRef, {
// //     // ...
// // });

// let contactData = [];

// async function retData() {
//     const dbRef = ref(db);
//     try {
//         const snapshot = await get(child(dbRef, 'users/' + USER_ID));
//         console.log(snapshot.val());
//         if (snapshot.exists()) {
//             console.log(snapshot.val().contacts);
//             contactData = snapshot.val().contacts;
//         } else {
//             alert("Employee does not exist");
//         }
//     } catch (error) {
//         alert('Unsuccessful');
//         console.log(error);
//     }
// }

// await retData();
// console.log('dat', contactData);

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
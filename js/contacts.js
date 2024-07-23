let contacts = [];

window.onload = function () {
    includeHTML();
    renderContacts();
    getUserLists();
};

async function getUserLists() {
    try {
        currUserData = await getUserData(USER_ID);
        if (!currUserData.contacts) {
            contacts = [];
        } else {
            contacts = currUserData.contacts;
            renderContacts();
        }
        if (!currUserData.tasks) {
            tasks = [];
        } else {
            tasks = currUserData.tasks;
            //place renderTasks(); here
        }
        // console.log(contacts);
        // console.log(tasks);
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    }
}

function loadUserIdLocalStorage() {
    const idAsText = localStorage.getItem('userId');
    userId = idAsText ? JSON.parse(idAsText) : '';
}

function renderContacts() {
    const content = document.getElementById('contacts-content');
    content.innerHTML = '';
    content.innerHTML = createButtonCard();
    let groupedNames = giveGroupedContacts();
    for (const k in groupedNames) {
        if (Object.hasOwnProperty.call(groupedNames, k)) {
            const elements = groupedNames[k];
            content.innerHTML += createLetterCard(k);
            elements.forEach(element => {
                const initials = `${getFirstLetterOfName(element.name)}${getFirstLetterOfName(element.surname)}`;
                content.innerHTML += createContactCard(element, initials);
            });
        }
    }
}

function giveGroupedContacts() {
    let names = sortContactsByName();
    return groupedNames = groupByInitials(names);
}

function renderContactDetailCard(id, initials) {
    const content = document.getElementById('contact-detail-card');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createDetailedContactCard(id, initials);
    content.classList.add('slide-in');
}

function closeContactDetailCard() {
    const content = document.getElementById('contact-detail-card');
    content.classList.add('slide-out');
    setTimeout(() => {
        content.innerHTML = '';
    }, 400);
}

function renderEditOverlay(id, initials) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createEditOverlay(id, initials);
}

function renderAddOverlay(id) {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createAddOverlay(id);
    setTimeout(() => {
        body.style.overflow = null;
    }, 400);
}

function closeOverlay() {
    const content = document.getElementById('overlay-section');
    content.style.display = 'none';
}

function closeOverlayEdit() {
    const content = document.getElementById('overlay-section');
    const card = document.getElementById('edit-overlay-container');
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
    card.classList.add('slide-out-overlay-left');
    setTimeout(() => {
        content.style.display = 'none';
        body.style.overflow = null;
    }, 400);
}

function closeOverlayAdd() {
    const content = document.getElementById('overlay-section');
    const card = document.getElementById('add-overlay-container');
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
    card.classList.add('slide-out-overlay');
    setTimeout(() => {
        content.style.display = 'none';
        body.style.overflow = null;
    }, 400);
}

function deleteContact(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
    }
    closeContactDetailCard();
    renderContacts();
    updateUser(currUserData.name, currUserData.email, currUserData.password, contacts);
}

function deleteContactOverlay(id) {
    closeOverlay();
    closeContactDetailCard();
    setTimeout(() => {
        const index = contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            contacts.splice(index, 1);
        }
        renderContacts();
    }, 0);
    updateUser(currUserData.name, currUserData.email, currUserData.password, contacts);
}

function sortContactsByName() {
    let names = contacts.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    });
    return names
}

function groupByInitials(arr) {
    return arr.reduce((acc, user) => {
        const initial = user.name.charAt(0).toUpperCase();
        if (!acc[initial]) {
            acc[initial] = [];
        }
        acc[initial].push({ id: user.id, name: user.name, surname: user.surname, email: user.email, phoneNumber: user.phoneNumber, color: user.color });
        return acc;
    }, {});
}

function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name.toUpperCase()
}

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function addContact() {
    const [name, surname = ''] = document.getElementById('add-name-overlay').value.split(" ");
    const email = document.getElementById('add-email-overlay').value;
    const phoneNumber = document.getElementById('add-phoneNumber-overlay').value;
    const colorArr = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    const rand = Math.floor(Math.random() * colorArr.length);
    const color = colorArr[rand];
    const id = Number(Date.now().toString());
    contacts.push({ id: id, name: name, surname: surname, email: email, phoneNumber: phoneNumber, color: color });
    closeOverlay();
    renderContacts();
    updateUser(currUserData.name, currUserData.email, currUserData.password, contacts, tasks);
}

function editContact(id, initials) {
    const contact = getObjectById(contacts, id);
    const [name, surname = ''] = document.getElementById('edit-name-overlay').value.split(" ");
    contact.name = name;
    contact.surname = surname;
    contact.email = document.getElementById('edit-email-overlay').value;
    contact.phoneNumber = document.getElementById('edit-phoneNumber-overlay').value;
    closeOverlay();
    renderContacts();
    renderContactDetailCard(id, initials);
    updateUser(currUserData.name, currUserData.email, currUserData.password, contacts, tasks);
}

function setContactActive(e) {
    const activeE = document.getElementsByClassName('contact-card active');
    [...activeE].forEach(element => element.classList.remove('active'));
    const currTarget = e.currentTarget;
    currTarget.classList.add('active');
}

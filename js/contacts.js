let contacts = [];

window.onload = function () {
    includeHTML();
    renderContacts();
    getUser();
};

async function getUser() {
    try {
        CURRENT_USER_DATA = await getUserData(USER_ID);
        setUserInitals();
        setUserLists();
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    }
}

function setUserLists() {
    if (!CURRENT_USER_DATA.contacts) {
        contacts = [];
    } else {
        contacts = CURRENT_USER_DATA.contacts;
        renderContacts();
    }
    if (!CURRENT_USER_DATA.tasks) {
        tasks = [];
    } else {
        tasks = CURRENT_USER_DATA.tasks;
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
    renderMobileEditBtn(id, initials);
    const width = document.body.clientWidth;
    const content = document.getElementById('contact-detail-card');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createDetailedContactCard(id, initials);
    if (width > 1200) {
        content.classList.add('slide-in');
    } 
}

function renderMobileEditBtn(id, initials) {
    const width = document.body.clientWidth;
    const editBtn = document.getElementById('edit-btn-media');
    editBtn.innerHTML = createEditDeleteBtn(id, initials);
    if (width <= 800) {
        editBtn.style.display = 'flex';
    }
}

function closeContactDetailCard() {
    const content = document.getElementById('contact-detail-card');
    content.classList.add('slide-out');
    setTimeout(() => {
        content.innerHTML = '';
        content.classList.remove('slide-out')
        content.style.display = 'none';
    }, 400);
}

function closeContactDetailCardWithoutSlideIn() {
    const content = document.getElementById('contact-detail-card');
    const editBtn = document.getElementById('edit-btn-media');
    setTimeout(() => {
        content.innerHTML = '';
        editBtn.style.display = 'none';
        content.style.display = 'none';
    }, 0);
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
    updateUser(CURRENT_USER_DATA.name, CURRENT_USER_DATA.email, CURRENT_USER_DATA.password, contacts);
}

function deleteContactMedia(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
    }
    closeContactDetailCardWithoutSlideIn();
    renderContacts();
    updateUser(CURRENT_USER_DATA.name, CURRENT_USER_DATA.email, CURRENT_USER_DATA.password, contacts);
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
    updateUser(CURRENT_USER_DATA.name, CURRENT_USER_DATA.email, CURRENT_USER_DATA.password, contacts);
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
    const [initials, id] = setContactProperties();
    closeOverlay();
    renderContacts();
    renderContactDetailCard(id,initials);
    renderContactSnack();
    updateUser(CURRENT_USER_DATA.name, CURRENT_USER_DATA.email, CURRENT_USER_DATA.password, contacts, tasks);
    setTimeout(() => {
        closeContactSnack();
    }, 1000);
}

function setContactProperties() {
    const [name, surname = ''] = document.getElementById('add-name-overlay').value.split(" ");
    const email = document.getElementById('add-email-overlay').value;
    const phoneNumber = document.getElementById('add-phoneNumber-overlay').value;
    const color = colorRandomizer();
    const id = Number(Date.now().toString());
    contacts.push({ id: id, name: name, surname: surname, email: email, phoneNumber: phoneNumber, color: color }); 
    const initials = `${getFirstLetterOfName(name)}${getFirstLetterOfName(surname)}`;
    return [initials, id];
}

function colorRandomizer() {
    const colorArr = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    const rand = Math.floor(Math.random() * colorArr.length);
    const color = colorArr[rand];
    return color;
}

function renderContactSnack() {
    const content = document.getElementById('snack');
    content.classList.add('slide-in-bottom');
    content.innerHTML = createContactSnack();
}

function closeContactSnack() {
    const content = document.getElementById('snack');
    content.classList.add('slide-out-bottom');
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
    updateUser(CURRENT_USER_DATA.name, CURRENT_USER_DATA.email, CURRENT_USER_DATA.password, contacts, tasks);
}

function setContactActive(e) {
    const activeE = document.getElementsByClassName('contact-card active');
    [...activeE].forEach(element => element.classList.remove('active'));
    const currTarget = e.currentTarget;
    currTarget.classList.add('active');
}

function renderEditContainer(id, initials) {
    const content = document.getElementById('edit-btn-media');
    content.innerHTML = createEditContainer(id, initials);
}

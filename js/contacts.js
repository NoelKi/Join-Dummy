let contacts = [
    {
        'id': 0,
        'name': 'Paul',
        'surname': 'Blau',
        'email': 'paul.blau@icloud.com',
        'phoneNumber': '+05123249320448',
        'color': '#FF7A00'
    },
    {
        'id': 1,
        'name': 'Hans',
        'surname': 'Gelb',
        'email': 'hans.gelb@icloud.com',
        'phoneNumber': '+05123249320448',
        'color': '#00BEE8'
    },
    {
        'id': 2,
        'name': 'Achim',
        'surname': 'Rot',
        'email': 'achim.rot@icloud.com',
        'phoneNumber': '+05123249320448',
        'color': '#1FD7C1'
    },
    {
        'id': 3,
        'name': 'Anette',
        'surname': 'Rot',
        'email': 'anette.rot@icloud.com',
        'phoneNumber': '+05123249320448',
        'color': '#FFBB2B'
    },
    {
        'id': 4,
        'name': 'Johannes',
        'surname': 'Grün',
        'email': 'johannes.gruen@icloud.com',
        'phoneNumber': '+05123249320448',
        'color': '#FC71FF'
    },
]

let currendId = 5;

function renderContacts() {
    const content = document.getElementById('contacts-content');
    let names = sortContactsByName();
    let groupedNames = groupByInitials(names);
    content.innerHTML = '';
    content.innerHTML = createButtonCard();
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

function renderContactDetailCard(id, initials) {
    const content = document.getElementById('contact-detail-card');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createDetailedContactCard(id, initials);
    content.classList.add('slide-in');
}

function closeContactDetailCard() {
    const content = document.getElementById('contact-detail-card');
    content.innerHTML = '';
}

function renderEditOverlay(id, initials) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createEditOverlay(id, initials);
}

function renderAddOverlay(id) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createAddOverlay(id);
}

function closeOverlay() {
    const content = document.getElementById('overlay-section');
    content.style.display = 'none';
}

function deleteContact(id) {
    console.log(id);
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
    }
    console.log(`index Korrekt ${index}`);
    closeContactDetailCard();
    renderContacts();
}

function deleteContact(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
        console.log(`Deleted contact at index: ${index}`);
    } else {
        console.log(`Contact with id: ${id} not found`);
    }
    closeContactDetailCard();
    renderContacts();
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

function createContactCard(contact, initials) {
    return `
    <div class="contact-card" id="contact-card" onclick="renderContactDetailCard(${contact.id},'${initials}')">
    <div class="initials" style="background-color: ${contact.color};" id="initials">${initials}</div>
    <div class="contact-data">
    <p id="contact-name">${contact.name} ${contact.surname}</p>
    <p class="contact-email">${contact.email}</p>
    </div>
    </div>`;
}

function createLetterCard(letter) {
    return `
    <div class="letter-container">
    <p id="letter">${letter}</p>
    <div class="contacts-separator"></div>
    </div>`;
}

function createButtonCard() {
    return `
    <div class="add-contacts-container">
        <button class="add-contacts-btn" onclick="renderAddOverlay()">
            Add new contact 
            <img class="contact-icon" src="../assets/img/contact.svg" alt="contact-img">
        </button>
    </div>`;
}

function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name.toUpperCase()
}

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function createDetailedContactCard(id, initials) {
    const contact = getObjectById(contacts, id);
    return `
    <div class="top-contact-container">
        <div class="initials-big" style="background-color: ${contact.color};" id="initials">${initials}</div>
        <div class="contact-name-container">
            <p class="contact-detail-name">${contact.name} ${contact.surname}</p>
            <div class="contact-edit-container">
                <div class="contact-edit-inner-container" onclick="renderEditOverlay(${contact.id},'${initials}');">
                    <img src="../assets/img/pencil.svg" alt="pencil">Edit
                </div>
                <div class="contact-edit-inner-container" onclick="deleteContact(${id});">
                    <img src="../assets/img/bin.svg" alt="bin">Delete
                </div>
            </div>

        </div>
    </div>
    <div class="contact-detail-container">
        <p class="contact-information"><b>Contact Information</b></p>
        <p class="contact-sign">Email</p>
        <p class="contact-email">${contact.email}</p>
        <p class="contact-sign">Phone</p>
        <p class="contact-phoneNumber">${contact.phoneNumber}</p>
    </div>
    `;
}

function createEditOverlay(id, initials) {
    const contact = getObjectById(contacts, id);
    console.log(id);
    return `
    <div class="overlay-section">
        <div class="edit-overlay-container" id="edit-overlay-container">
            <div class="edit-top-container">
                <img src="../assets/img/join.svg" alt="Join" class="join-logo-overlay">
                <p class="overlay-headline">Edit contact</p>
                <button class="close-btn-overlay" onclick="closeOverlay()">
                    <img src="../assets/img/closeOverlay.svg" alt="X">
                </button>
            </div>
            <div class="edit-bottom-container">
                <div class="edit-container">
                    <div class="initials-overlay" style="background-color: ${contact.color};">${initials}</div>
                    <form class="overlay-form" onsubmit="editContact(${contact.id},'${initials}'); return false;" >
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" id="edit-name-overlay" type="text" value="${contact.name} ${contact.surname}" required>
                            <img src="../assets/img/personOverlay.svg" alt="person">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" id="edit-email-overlay" type="email" value="${contact.email}" required>
                            <img src="../assets/img/letterOverlay.svg" alt="letter">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" id="edit-phoneNumber-overlay" value="${contact.phoneNumber}" required>
                            <img src="../assets/img/phoneOverlay.svg" alt="phone">
                        </div>
                        <div class="overlay-btn">
                            <button class="overlay-white-btn" onclick="deleteContactOverlay(${id})" type="button">
                                Delete
                            </button>
                            <button class="overlay-blue-btn" type="submit">
                                Save &emsp; <img src="../assets/img/checkOverlay.svg" alt="check">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
}

function createAddOverlay(id) {
    return `        
    <div class="overlay-section">
        <div class="add-overlay-container" id="edit-overlay-container">
            <div class="add-top-container">
                <img src="../assets/img/join.svg" alt="Join" class="join-logo-overlay">
                <p class="overlay-headline">Add contact</p>
                <p class="overlay-p">Tasks are better with a team!</p>
                <button class="close-btn-overlay" onclick="closeOverlay()">
                    <img src="../assets/img/closeOverlay.svg" alt="X">
                </button>
            </div>
            <div class="edit-bottom-container">
                <div class="edit-container">
                    <div class="initials-overlay" style="background-color: #D1D1D1;">
                        <img class="initials-placeholder" src="../assets/img/personOverlay.svg" alt="">
                    </div>
                    <form class="overlay-form"  onsubmit="addContact(); return false;">
                        <div class="overlay-input-container">
                            <input class="overlay-input-field"  placeholder="Name" type="text" id="add-name-overlay" required>
                            <label for="add-name-overlay"></label>
                            <img src="../assets/img/personOverlay.svg" alt="person">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" placeholder="Email" type="email" id="add-email-overlay" required>
                            <img src="../assets/img/letterOverlay.svg" alt="letter">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" placeholder="Phone" type="tel" id="add-phoneNumber-overlay" required>
                            <img src="../assets/img/phoneOverlay.svg" alt="phone">
                        </div>
                        <div class="overlay-btn">
                            <button class="overlay-white-btn" onclick="closeOverlay();" type="button">
                                Cancel <img src='../assets/img/closeAddContacts.svg' alt="x">
                            </button>
                            <button class="overlay-blue-btn" type="submit">
                                Create Contact &ensp; <img src="../assets/img/checkOverlay.svg" alt="check">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;
}

function addContact() {
    const fullnameArr = document.getElementById('add-name-overlay').value.split(" ");
    const [name, surname] = fullnameArr;
    const email = document.getElementById('add-email-overlay').value;
    const phoneNumber = document.getElementById('add-phoneNumber-overlay').value;
    const colorArr = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    const rand = Math.floor(Math.random() * colorArr.length);
    const color = colorArr[rand];
    currendId = currendId + 1;
    contacts.push({ id: currendId, name: name, surname: surname, email: email, phoneNumber: phoneNumber, color: color });
    closeOverlay();
    renderContacts();
}

function editContact(id, initials) {
    const contact = getObjectById(contacts, id);
    const fullnameArr = document.getElementById('edit-name-overlay').value.split(" ");
    const [name, surname] = fullnameArr;
    contact.name = name;
    contact.surname = surname;
    contact.email = document.getElementById('edit-email-overlay').value;
    contact.phoneNumber = document.getElementById('edit-phoneNumber-overlay').value;
    closeOverlay();
    renderContacts();
    renderContactDetailCard(id, initials);
}
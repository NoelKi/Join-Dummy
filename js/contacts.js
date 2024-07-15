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

function renderContacts() {
    const content = document.getElementById('contacts-content');
    let names = sortUsersByName();
    let groupedNames = groupByInitials(names);
    content.innerHTML = '';
    content.innerHTML = createButtonCard();
    for (const k in groupedNames) {
        if (Object.hasOwnProperty.call(groupedNames, k)) {
            const elements = groupedNames[k];
            content.innerHTML += createLetterCard(k);
            elements.forEach(element => {
                const initials = `${getFirstLetterOfName(element.name)}${getFirstLetterOfName(element.surname)}`;
                content.innerHTML += createContactCard(element,initials)
            });
        }
    }
}

function renderContactDetailCard(id,initials) {
    const content = document.getElementById('contact-detail-card');
    content.innerHTML = '';
    content.innerHTML = createDetailedContactCard(id,initials);
    content.classList.add('slide-in');
}

function renderEditOverlay(id,initials) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createEditOverlay(id,initials);
}

function renderAddOverlay(id,initials) {
    const content = document.getElementById('overlay-section');
    content.style.display = 'block';
    content.innerHTML = '';
    content.innerHTML = createAddOverlay(id);
}

function closeEditOverlay() {
    const content = document.getElementById('overlay-section');
    content.style.display = 'none';
}

function deleteContact(id) {
    // delete with fetch.delete
}

function sortUsersByName() {
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
        acc[initial].push({id: user.id, name: user.name, surname: user.surname, email: user.email, phoneNumber: user.phoneNumber, color: user.color});
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
    const contact = getObjectById(contacts,id);
    return `
    <div class="top-contact-container">
        <div class="initials-big" style="background-color: ${contact.color};" id="initials">${initials}</div>
        <div class="contact-name-container">
            <p class="contact-detail-name">${contact.name} ${contact.surname}</p>
            <div class="contact-edit-container">
                <div class="contact-edit-inner-container" onclick="renderEditOverlay(${contact.id},'${initials}');">
                    <img src="../assets/img/pencil.svg" alt="pencil">Edit
                </div>
                <div class="contact-edit-inner-container" onclick="console.log('delete');">
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

function createEditOverlay(id,initials) {
    const contact = getObjectById(contacts,id);
    return `
    <div class="overlay-section">
        <div class="edit-overlay-container" id="edit-overlay-container">
            <div class="edit-top-container">
                <img src="../assets/img/join.svg" alt="Join" class="join-logo-overlay">
                <p class="overlay-headline">Edit contact</p>
                <button class="close-btn-overlay" onclick="closeEditOverlay()">
                    <img src="../assets/img/closeOverlay.svg" alt="X">
                </button>
            </div>
            <div class="edit-bottom-container">
                <div class="edit-container">
                    <div class="initials-overlay" style="background-color: blue;">${initials}</div>
                    <form class="overlay-form">
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" value="${contact.name} ${contact.surname}">
                            <img src="../assets/img/personOverlay.svg" alt="person">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" value="${contact.email}">
                            <img src="../assets/img/letterOverlay.svg" alt="letter">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" value="${contact.phoneNumber}">
                            <img src="../assets/img/phoneOverlay.svg" alt="phone">
                        </div>
                        <div class="overlay-btn">
                            <button class="overlay-white-btn" onclick="console.log('delete');">
                                Delete
                            </button>
                            <button class="overlay-blue-btn" onclick="console.log('save');">
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
                <button class="close-btn-overlay" onclick="closeEditOverlay()">
                    <img src="../assets/img/closeOverlay.svg" alt="X">
                </button>
            </div>
            <div class="edit-bottom-container">
                <div class="edit-container">
                    <div class="initials-overlay" style="background-color: #D1D1D1;">
                        <img class="initials-placeholder" src="../assets/img/personOverlay.svg" alt="">
                    </div>
                    <form class="overlay-form">
                        <div class="overlay-input-container">
                            <input class="overlay-input-field"  placeholder="Name">
                            <img src="../assets/img/personOverlay.svg" alt="person">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" placeholder="Email">
                            <img src="../assets/img/letterOverlay.svg" alt="letter">
                        </div>
                        <div class="overlay-input-container">
                            <input class="overlay-input-field" placeholder="Phone">
                            <img src="../assets/img/phoneOverlay.svg" alt="phone">
                        </div>
                        <div class="overlay-btn">
                            <button class="overlay-white-btn" onclick="closeEditOverlay();">
                                Cancel <img src='../assets/img/closeAddContacts.svg' alt="x">
                            </button>
                            <button class="overlay-blue-btn" onclick="console.log('save');">
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
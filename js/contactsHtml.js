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

function createAddOverlay() {
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

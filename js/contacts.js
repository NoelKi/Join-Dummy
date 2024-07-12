let users = [
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
        'surname': 'rot',
        'email': 'achim.rot@icloud.com',
        'phoneNumber': '+05123249320448',
        'color':'sandybrown'
    },
    {
        'id': 3,
        'name': 'Anette',
        'surname': 'rot',
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

function sortUsersByName() {
    let names = users.sort(function (a, b) {
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

function createContactCard(user, initials) {
    return `
    <div class="contact-card" id="contact-card" onclick="renderContactDetailCard(${user.id},'${initials}')">
        <div class="initials" style="background-color: ${user.color};" id="initials">${initials}</div>
        <div class="contact-data">
            <p id="contact-name">${user.name}</p>
            <p class="contact-email">${user.email}</p>
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
        <button class="add-contacts-btn">
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
    const user = getObjectById(users,id);
    return `
    <div class="top-contact-container">
        <div class="initials-big" style="background-color: ${user.color};" id="initials">${initials}</div>
        <div class="contact-name-container">
            <p class="contact-detail-name">${user.name} ${user.surname}</p>
            <div class="contact-edit-container">
                <div class="contact-edit-inner-container" onclick="console.log('edit');">
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
        <p class="contact-sign">email</p>
        <p class="contact-email">${user.email}</p>
        <p class="contact-sign">Phone</p>
        <p class="contact-phoneNumber">${user.phoneNumber}</p>
    </div>
    `;
}
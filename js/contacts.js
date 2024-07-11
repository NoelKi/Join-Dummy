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
        'id': 2,
        'name': 'Anette',
        'surname': 'rot',
        'email': 'anette.rot@icloud.com',
        'phoneNumber': '+05123249320448',
        'color':'indianred'
    },
    {
        'id': 3,
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
        acc[initial].push({name: user.name, surname: user.surname, email: user.email, phoneNumber: user.phoneNumber, color: user.color});
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
                content.innerHTML += createContactCard(element.name,element.email,initials,element.color)
            });
        }
    }
}

function createContactCard(name, email='add adress', initials, color='green') {
    return `
    <div class="contact-card" id="contact-card">
        <div class="initials" style="background-color: ${color};" id="initials">${initials}</div>
        <div class="contact-data">
            <p id="contact-name">${name}</p>
            <p class="contact-email">${email}</p>
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
let users = [
    {
        'id': 0,
        'name': 'Paul',
        'surname': 'Blau',
        'email': 'paul.blau@icloud.com',
        'phoneNumber': '+05123249320448'
    },
    {
        'id': 1,
        'name': 'Hans',
        'surname': 'Gelb',
        'email': 'hans.gelb@icloud.com',
        'phoneNumber': '+05123249320448'
    },
    {
        'id': 2,
        'name': 'Achim',
        'surname': 'rot',
        'email': 'achim.rot@icloud.com',
        'phoneNumber': '+05123249320448'
    },
    {
        'id': 2,
        'name': 'Anette',
        'surname': 'rot',
        'email': 'anette.rot@icloud.com',
        'phoneNumber': '+05123249320448'
    },
    {
        'id': 3,
        'name': 'Johannes',
        'surname': 'Grün',
        'email': 'johannes.gruen@icloud.com',
        'phoneNumber': '+05123249320448'
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
        acc[initial].push({name: user.name, email: user.email});
        return acc;
    }, {});
}

function renderContacts() {
    const content = document.getElementById('contacts-content');
    let names = sortUsersByName();
    let groupedNames = groupByInitials(names);
    content.innerHTML = '';
    for (const k in groupedNames) {
        if (Object.hasOwnProperty.call(groupedNames, k)) {
            const elements = groupedNames[k];
            content.innerHTML += createLetterCard(k);
            elements.forEach(element => {
                content.innerHTML += createContactCard(element.name,element.email)
            });
        }
    }
}

function createContactCard(name, email, initials = 'G') {
    return `
    <div class="contact-card" id="contact-card">
        <div class="initials" id="initials">${initials}</div>
        <div class="contact-data">
            <p id="contact-name">${name}</p>
            <p id="contact-email">${email}</p>
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

function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name
}
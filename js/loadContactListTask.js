function loadContactList(filteredContacts = contacts) {
    let listContainer = document.getElementById("generate-list");
    listContainer.innerHTML = "";
    let htmlContent = "";
  
    for (let i = 0; i < filteredContacts.length; i++) {
      let contact = filteredContacts[i];
      let initials = getFirstLetterOfName(contact.name) + getFirstLetterOfName(contact.surname);
      let selectedClass = selectionState[contact.id] ? 'selected' : '';
      htmlContent += generateContactHTML(contact, i, selectedClass, initials);
    }
    listContainer.innerHTML = htmlContent;
    assignContactEventListeners(filteredContacts);
  }

  function assignContactEventListeners(filteredContacts) {
    let contactAssignElements = document.querySelectorAll(".contact-task-assign");
    contactAssignElements.forEach((element) => {
      element.addEventListener("click", function () {
        handleContactAssignClick(element, filteredContacts);
      });
    });
  }

  function handleContactAssignClick(element, filteredContacts) {
    let index = element.dataset.index;
    let contact = filteredContacts[index];
  
    if (element.classList.contains("selected")) {
      deselectContact(element, contact);
    } else {
      selectContact(element, contact);
    }
    renderCollaborators();
  }


  function deselectContact(element, contact) {
    element.classList.remove("selected");
    element.querySelector(".check-box-task img").src = "../assets/img/checkBoxTaskHtml.svg";
    delete selectionState[contact.id];
    removeCollaborator(contact.id);
  }

  function removeCollaborator(contactId) {
    collaborators = collaborators.filter(collaborator => collaborator.id !== contactId);
  }

  function selectContact(element, contact) {
    element.classList.add("selected");
    element.querySelector(".check-box-task img").src = "../assets/img/checkedTaskHtml.svg";
    selectionState[contact.id] = true;
    addCollaborator(contact);
  }

  function addCollaborator(contact) {
    collaborators.push({
      id: contact.id,
      name: `${contact.name} ${contact.surname}`,
      color: contact.color
    });
  }

  function renderCollaborators() {
    let assignContactsCircle = document.getElementById("assign-contacts-circle");
    assignContactsCircle.innerHTML = "";
    collaborators.forEach(collaborator => {
      let initials = getFirstLetterOfName(collaborator.name.split(" ")[0]) + getFirstLetterOfName(collaborator.name.split(" ")[1]);
      assignContactsCircle.innerHTML += `
        <div class="initials-task-circle" style="background-color: ${collaborator.color};">${initials}</div>
      `;
    });
  }

  function clearSelectedContacts() {
    selectionState = {};
    document.querySelectorAll(".contact-task-assign").forEach(element => {
      element.classList.remove("selected");
      element.querySelector(".check-box-task img").src = "../assets/img/checkBoxTaskHtml.svg";
    });
  }

  function filterContacts(searchName) {
    searchName = searchName.toLowerCase();
    return contacts.filter((contact) => {
      return (
        contact.name.toLowerCase() +
        " " +
        contact.surname.toLowerCase()
      ).includes(searchName);
    });
  }

  function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name.toUpperCase();
  }
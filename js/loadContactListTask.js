
/**
 * Renders a list of contacts into the DOM. Clears the existing list and populates
 * it with HTML content generated from the `filteredContacts` array. Optionally,
 * uses a default list of contacts if no argument is provided. Also assigns event
 * listeners to each contact item.
 *
 * @param {Array<Object>} [filteredContacts=contacts] - An array of contact objects to display. 
 * Each contact object should contain at least `name`, `surname`, and `id` properties.
 * If not provided, the function defaults to using the global `contacts` array.
 * 
 * @returns {void}
 */
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

 
 /**
 * Assigns click event listeners to all elements with the class "contact-task-assign".
 * When a contact assignment element is clicked, it triggers the `handleContactAssignClick` function
 * with the clicked element and the `filteredContacts` array as arguments.
 *
 * @function
 * @param {Array<Object>} filteredContacts - An array of contact objects to be used by the event handler.
 * Each contact object should contain relevant properties for processing within `handleContactAssignClick`.
 * @returns {void}
 */
function assignContactEventListeners(filteredContacts) {
  let contactAssignElements = document.querySelectorAll(".contact-task-assign");
  contactAssignElements.forEach((element) => {
      element.addEventListener("click", function () {
          handleContactAssignClick(element, filteredContacts);
      });
  });
}

/**
 * Handles click events on contact assignment elements. Toggles the selection state
 * of the clicked contact based on its current state and updates the UI accordingly.
 * 
 * @function
 * @param {HTMLElement} element - The clicked contact assignment element. This element should have a `data-index` attribute
 *                                 indicating the index of the contact in the `filteredContacts` array.
 * @param {Array<Object>} filteredContacts - An array of contact objects. Each contact object represents a contact
 *                                            and should include properties relevant for selection.
 * @returns {void}
 */
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

 /**
 * Deselects a contact and updates the UI and internal state accordingly.
 * Removes the "selected" class from the contact element, updates the checkbox image to its default state,
 * and removes the contact from the selection state and collaborators.
 *
 * @function
 * @param {HTMLElement} element - The contact element that is being deselected. This element should have a class of "selected"
 *                                and include a child element with the class "check-box-task" containing an image.
 * @param {Object} contact - The contact object being deselected. This object should have at least an `id` property used to
 *                            identify the contact in the `selectionState` and collaborators.
 * @returns {void}
 */
function deselectContact(element, contact) {
  element.classList.remove("selected");
  element.querySelector(".check-box-task img").src = "../assets/img/checkBoxTaskHtml.svg";
  delete selectionState[contact.id];
  removeCollaborator(contact.id);
}

 /**
 * Removes a collaborator from the list of collaborators based on the provided contact ID.
 * Filters out the collaborator with the matching ID from the `collaborators` array.
 *
 * @function
 * @param {string|number} contactId - The ID of the contact to be removed from the collaborators list.
 *                                     The ID should match the `id` property of a collaborator object.
 * @returns {void}
 */
function removeCollaborator(contactId) {
  collaborators = collaborators.filter(collaborator => collaborator.id !== contactId);
}


 /**
 * Selects a contact and updates the UI and internal state accordingly.
 * Adds the "selected" class to the contact element, updates the checkbox image to the checked state,
 * and adds the contact to the selection state and collaborators list.
 *
 * @function
 * @param {HTMLElement} element - The contact element being selected. This element should not have the "selected"
 *                                class before selection and should include a child element with the class "check-box-task"
 *                                containing an image.
 * @param {Object} contact - The contact object being selected. This object should have at least an `id` property used to
 *                            update the `selectionState` and the collaborators list.
 * @returns {void}
 */
function selectContact(element, contact) {
  element.classList.add("selected");
  element.querySelector(".check-box-task img").src = "../assets/img/checkedTaskHtml.svg";
  selectionState[contact.id] = true;
  addCollaborator(contact);
}

/**
 * Adds a contact to the list of collaborators.
 * Creates a new collaborator object with the contact's ID, full name, and color, and appends it to the `collaborators` array.
 *
 * @function
 * @param {Object} contact - The contact object to be added as a collaborator. This object should include:
 *                            - `id`: The unique identifier of the contact.
 *                            - `name`: The first name of the contact.
 *                            - `surname`: The surname of the contact.
 *                            - `color`: A color associated with the contact.
 * @returns {void}
 */
function addCollaborator(contact) {
  collaborators.push({
    id: contact.id,
    name: `${contact.name} ${contact.surname}`,
    color: contact.color
  });
}

/**
 * Renders the list of collaborators in the DOM. Updates the content of the element with the ID "assign-contacts-circle"
 * to display each collaborator's initials inside a circle. Each circle is styled with the collaborator's associated color.
 *
 * @function
 * @returns {void}
 */
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

 
/**
 * Clears the selection state for all contacts and updates the UI accordingly.
 * Resets the `selectionState` object, removes the "selected" class from all contact assignment elements,
 * and updates the checkbox images to their default unchecked state.
 *
 * @function
 * @returns {void}
 */
function clearSelectedContacts() {
  // Reset the selection state
  selectionState = {};
  
  // Update UI for all contact assignment elements
  document.querySelectorAll(".contact-task-assign").forEach(element => {
      element.classList.remove("selected");
      element.querySelector(".check-box-task img").src = "../assets/img/checkBoxTaskHtml.svg";
  });
}
/**
 * Filters the list of contacts based on a search query. Returns a new array of contacts whose names or surnames
 * match the search query.
 *
 * @function
 * @param {string} searchName - The search query used to filter contacts. This string is converted to lowercase
 *                               for case-insensitive comparison.
 * @returns {Array<Object>} - An array of contact objects that match the search query. Each contact object should
 *                             include at least `name` and `surname` properties.
 */
function filterContacts(searchName) {
  searchName = searchName.toLowerCase();
  return contacts.filter((contact) => {
      return (
          (contact.name.toLowerCase() + " " + contact.surname.toLowerCase())
          .includes(searchName)
      );
  });
}

/**
 * Extracts the first letter of a given name and converts it to uppercase.
 * 
 * @function
 * @param {string} name - The name from which to extract the first letter. It should be a non-empty string.
 * @returns {string} - The uppercase version of the first letter of the provided name.
 */
function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}
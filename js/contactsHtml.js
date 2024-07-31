/**
 * Creates a contact card HTML string
 * @param {Object} contact - The contact object
 * @param {string} initials - The initials of the contact
 * @returns {string} HTML string for the contact card
 */
function createContactCard(contact, initials) {
  return `
      <div class="contact-card" id="contact-card-${contact.id}" onclick="renderContactDetailCard(${contact.id},'${initials}'); setContactActive(event);">
          <div class="initials" style="background-color: ${contact.color};" id="initials">${initials}</div>
          <div class="contact-data">
              <p id="contact-name">${contact.name} ${contact.surname}</p>
              <p class="contact-email">${contact.email}</p>
          </div>
      </div>`;
}

/**
 * Creates a detailed contact card HTML string
 * @param {number} id - The ID of the contact
 * @param {string} initials - The initials of the contact
 * @returns {string} HTML string for the detailed contact card
 */
function createDetailedContactCard(id, initials) {
  const contact = getObjectById(contacts, id);
  return `
      <div class="contact-information-container">Contact Information <img class="back-arrow-contact-detail-card" src="../assets/img/arrowLeft.svg" alt="Arrow left" onclick="closeContactDetailCardWithoutSlideIn()"></div>
      <div class="top-contact-container">
          <div class="initials-big" style="background-color: ${contact.color};" id="initials">${initials}</div>
          <div class="contact-name-container">
              <p class="contact-detail-name">${contact.name} ${contact.surname}</p>
              <div class="contact-edit-container">
                  <div class="contact-edit-inner-container" onclick="renderEditOverlay(${contact.id},'${initials}');">
                      <img class="unhover-btn" src="../assets/img/editUnhover.svg" alt="pencil">
                      <img class="hover-btn" src="../assets/img/editHover.svg" alt="pencil">
                  </div>
                  <div class="contact-edit-inner-container" onclick="deleteContact(${id});">
                      <img class="unhover-btn" src="../assets/img/deleteUnhover.svg" alt="bin">
                      <img class="hover-btn" src="../assets/img/deleteHover.svg" alt="pencil">
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

/**
 * Creates an edit overlay HTML string
 * @param {number} id - The ID of the contact
 * @param {string} initials - The initials of the contact
 * @returns {string} HTML string for the edit overlay
 */
function createEditOverlay(id, initials) {
  const contact = getObjectById(contacts, id);
  return `
      <div class="overlay-section">
          <div class="edit-overlay-container slide-in-overlay-left" id="edit-overlay-container">
              <div class="edit-top-container">
                  <img src="../assets/img/join.svg" alt="Join" class="join-logo-overlay">
                  <p class="overlay-headline">Edit contact</p>
                  <button class="close-btn-overlay" onclick="closeOverlayEdit()">
                      <img src="../assets/img/closeOverlay.svg" alt="X">
                  </button>
                  <div class="initials-overlay-media margin-special" style="background-color: #D1D1D1;">
                      <img class="initials-placeholder" src="../assets/img/personOverlay.svg" alt="">
                  </div>
              </div>
              <div class="edit-bottom-container">
                  <div class="edit-container">
                      <div class="initials-overlay" style="background-color: ${contact.color};">${initials}</div>
                      <form class="overlay-form" onsubmit="editContact(${contact.id},'${initials}'); return false;">
                          <div class="overlay-input-container">
                              <input class="overlay-input-field input-person" id="edit-name-overlay" type="text" value="${contact.name} ${contact.surname}" required>
                          </div>
                          <div class="overlay-input-container">
                              <input class="overlay-input-field input-letter" id="edit-email-overlay" type="email" value="${contact.email}" required>
                          </div>
                          <div class="overlay-input-container">
                              <input class="overlay-input-field input-tel" id="edit-phoneNumber-overlay" value="${contact.phoneNumber}" required>
                          </div>
                          <div class="overlay-btn">
                              <button class="overlay-white-btn" onclick="deleteContactOverlay(${id})" type="button">
                                  Delete
                              </button>
                              <button class="overlay-blue-btn" type="submit">
                                  Save &emsp; <img src="../assets/img/checkOverlay.svg" class="white-check-overlay" alt="check"><img src="../assets/img/checkOverlayBlue.svg" class="blue-check-overlay" alt="check">
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      `;
}

/**
 * Creates an add overlay HTML string
 * @returns {string} HTML string for the add overlay
 */
function createAddOverlay() {
  return `        
      <div class="overlay-section">
          <div class="add-overlay-container slide-in-overlay" id="add-overlay-container">
              <div class="add-top-container">
                  <img src="../assets/img/join.svg" alt="Join" class="join-logo-overlay">
                  <p class="overlay-headline">Add contact</p>
                  <p class="overlay-p">Tasks are better with a team!</p>
                  <button class="close-btn-overlay" onclick="closeOverlayAdd()">
                      <img src="../assets/img/closeOverlay.svg" alt="X">
                  </button>
                  <div class="initials-overlay-media" style="background-color: #D1D1D1;">
                      <img class="initials-placeholder" src="../assets/img/personOverlay.svg" alt="">
                  </div>
              </div>
              <div class="edit-bottom-container">
                  <div class="edit-container">
                      <div class="initials-overlay" style="background-color: #D1D1D1;">
                          <img class="initials-placeholder" src="../assets/img/personOverlay.svg" alt="">
                      </div>
                      <form class="overlay-form"  onsubmit="addContact(); return false;">
                          <div class="overlay-input-container">
                              <input class="overlay-input-field input-person" placeholder="Name" type="text" id="add-name-overlay" required>
                              <label for="add-name-overlay"></label>
                              <p id="error-message" style="color: red; display: none;">Bitte geben Sie sowohl einen Vor- als auch einen Nachnamen ein.</p>
                          </div>
                          <div class="overlay-input-container">
                              <input class="overlay-input-field input-letter" placeholder="Email" type="email" id="add-email-overlay" required>
                          </div>
                          <div class="overlay-input-container">
                              <input class="overlay-input-field input-tel" placeholder="Phone" type="tel" id="add-phoneNumber-overlay" required>
                          </div>
                          <div class="overlay-btn">
                              <button class="overlay-white-btn" id="cancel-btn-overlay" onclick="closeOverlay();" type="button">
                                  Cancel <img src='../assets/img/closeAddContacts.svg' class="hover-btn-grey" alt="x"> <img src='../assets/img/closeAddContactHover.svg' class="hover-btn-blue" alt="x">
                              </button>
                              <button class="overlay-blue-btn" type="submit">
                                  Create Contact &ensp; <img src="../assets/img/checkOverlay.svg" class="white-check-overlay" alt="check"><img src="../assets/img/checkOverlayBlue.svg" class="blue-check-overlay" alt="check">
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  `;
}

/**
 * Creates a letter card HTML string
 * @param {string} letter - The letter to display
 * @returns {string} HTML string for the letter card
 */
function createLetterCard(letter) {
  return `
      <div class="letter-container">
      <p id="letter">${letter}</p>
      <div class="contacts-separator"></div>
      </div>`;
}

/**
 * Creates a button card HTML string
 * @returns {string} HTML string for the button card
 */
function createButtonCard() {
  return `
      <div class="add-contacts-container">
          <button class="add-contacts-btn" onclick="renderAddOverlay()">
              Add new contact 
              <img class="contact-icon" src="../assets/img/contact.svg" alt="contact-img">
              <img class="contact-icon-hover" src="../assets/img/contactHover.svg" alt="contact-img">
          </button>
      </div>
      <div class="add-contacts-container-media" onclick="renderAddOverlay()">
          <img src="../assets/img/contact.svg" alt="contact-img">
      </div>`;
}

/**
 * Creates an edit/delete button HTML string
 * @param {number} id - The ID of the contact
 * @param {string} initials - The initials of the contact
 * @returns {string} HTML string for the edit/delete button
 */
function createEditDeleteBtn(id, initials) {
  return `
      <div class="edit-contacts-container-media" onclick="renderEditContainer(${id},'${initials}')">
          <img src="../assets/img/threeDots.svg" alt=":">
      </div>`;
}

/**
 * Creates a contact snack notification HTML string
 * @returns {string} HTML string for the contact snack notification
 */
function createContactSnack() {
  return `<div class="snack slide-in-bottom">
      Contact succesfully created    
      </div>`;
}

/**
 * Creates an edit container HTML string
 * @param {number} id - The ID of the contact
 * @param {string} initials - The initials of the contact
 * @returns {string} HTML string for the edit container
 */
function createEditContainer(id, initials) {
  const contact = getObjectById(contacts, id);
  return `
      <div class="edit-delete-overlay-container">            
          <div class="contact-edit-container-media">
              <div class="contact-edit-inner-container" onclick="renderEditOverlay(${contact.id},'${initials}');">
                  <img class="unhover-btn" src="../assets/img/editUnhover.svg" alt="pencil">
                  <img class="hover-btn" src="../assets/img/editHover.svg" alt="pencil">
              </div>
              <div class="contact-edit-inner-container" onclick="deleteContactMedia(${id});" style="margin-top: 16px;">
                  <img class="unhover-btn" src="../assets/img/deleteUnhover.svg" alt="bin">
                  <img class="hover-btn" src="../assets/img/deleteHover.svg" alt="bin">
              </div>
          </div>
      </div>
      `;
}

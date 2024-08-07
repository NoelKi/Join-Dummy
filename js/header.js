/**
 * Toggles the visibility of the popup navigation menu.
 * When the popup is shown, it adds the 'show' class and removes the 'hide' class.
 * When the popup is hidden, it adds the 'hide' class and removes the 'show' class.
 * It also manages the event listeners for keyboard and click events to close the popup.
 * @function
 */
function myFunction() {
  const popupNav = document.getElementById("popup-nav");
  isPopupVisible = !isPopupVisible;
  if (isPopupVisible) {
    popupNav.classList.remove('hide');
    popupNav.classList.add('show');
    document.addEventListener("keydown", keyPress);
    document.addEventListener("click", clickOutside);
  } else {
    popupNav.classList.remove('show');
    popupNav.classList.add('hide');
    document.removeEventListener("keydown", keyPress);
    document.removeEventListener("click", clickOutside);
  }
}


/**
 * Handles keypress events to close the popup when the Escape key is pressed.
 * @param {KeyboardEvent} e - The keypress event object.
 * @function
 */
function keyPress(e) {
  if (e.key === "Escape") {
    myFunction();
  }
}


/**
 * Closes the popup navigation menu when a click is detected outside the menu
 * and the profile button.
 * @param {MouseEvent} e - The click event object.
 * @function
 */
function clickOutside(e) {
  if (!document.getElementById("profil-btn").contains(e.target) &&
    !document.getElementById("popup-nav").contains(e.target)) {
    myFunction();
  }
}


/**
 * Sets the user's initials in the profile button based on the `CURRENT_USER_DATA`.
 * Assumes `CURRENT_USER_DATA` is an object with a `name` property.
 * The initials are computed from the first letters of the user's first and last names.
 * @function
 */
function setUserInitals() {
  const fullName = CURRENT_USER_DATA.name;
  const [name, surname = ''] = fullName.split(' ');
  const initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
  document.getElementById("profil-btn").innerHTML = initials;
}
/**
 * Event listener for the click event on the `clearTaskBtn` element.
 * Clears all input fields and then performs a check on the inputs.
 *
 * @function
 * @returns {void}
 */
clearTaskBtn.addEventListener("click", function () {
  clearAllInputs();
  checkInputs();
});

/**
 * Event listener for the click event on the `selectOption` element.
 * Toggles the "active-task" class on the `selectBox` element.
 *
 * @function
 * @returns {void}
 */
selectOption.addEventListener("click", function () {
  selectBox.classList.toggle("active-task");
});

/**
 * Adds a click event listener to each element in the `optionList` array.
 * When an element is clicked, it updates the `selectValue` input with the
 * text content of the clicked element, removes the "active-task" class from
 * the `selectBox` element, and performs a check on the inputs.
 *
 * @param {HTMLElement[]} optionList - An array of HTML elements representing options in a list.
 * @param {HTMLElement} selectValue - The input element where the selected option's text will be set.
 * @param {HTMLElement} selectBox - The element from which the "active-task" class will be removed.
 * @param {function} checkInputs - A function to perform a check on the inputs.
 * @returns {void}
 */
optionList.forEach(function (optionListSingle) {
  optionListSingle.addEventListener("click", function () {
    text = this.textContent;
    selectValue.value = text;
    selectBox.classList.remove("active-task");
    checkInputs();
  });
});

/**
 * Event listener for the focusout event on the `titleInput` element.
 * Validates the input value when the element loses focus. If the input is empty,
 * displays an error message and sets the border color to indicate an error.
 * Otherwise, hides the error message and resets the border color.
 * Calls the `checkInputs` function to perform further validation or actions.
 *
 * @function
 * @returns {void}
 */
titleInput.addEventListener("focusout", function () {
  if (titleInput.value.trim() === "") {
    titleError.style.display = "inline";
    titleInput.style.borderBottomColor = "#ff8190";
  } else {
    titleError.style.display = "none";
    titleInput.style.borderBottomColor = "";
  }
  checkInputs();
});

/**
 * Event listener for the focusout event on the `dateInput` element.
 * Validates the input value when the element loses focus. If the input is empty,
 * displays an error message, changes the border color to indicate an error, and sets
 * the text color to black. If the input is not empty, hides the error message, resets
 * the border color, and maintains the text color as black.
 * Calls the `checkInputs` function to perform additional validation or actions.
 *
 * @function
 * @returns {void}
 */
dateInput.addEventListener("focusout", function () {
  if (dateInput.value.trim() === "") {
    dateError.style.display = "inline";
    dateInput.style.borderBottomColor = "#ff8190";
    dateInput.style.color = "black";
  } else {
    dateError.style.display = "none";
    dateInput.style.borderBottomColor = "";
    dateInput.style.color = "black";
  }
  checkInputs();
});

/**
 * Adds an event listener to the task form to handle form submission.
 *
 * This function prevents the form from submitting if either the title or date input fields are empty.
 * If the title field is empty, it displays an error message for the title input. Similarly,
 * if the date field is empty, it displays an error message for the date input. After checking
 * the inputs, it calls `checkInputs()` to perform any additional validation.
 *
 * @param {Event} event - The event object associated with the form submission.
 *
 * @listens submit#task-form - This event listener is triggered when the form with ID "task-form" is submitted.
 */
document
  .getElementById("task-form")
  .addEventListener("submit", function (event) {
    if (titleInput.value.trim() === "" || dateInput.value.trim() === "") {
      event.preventDefault();
      if (titleInput.value.trim() === "") {
        titleError.style.display = "inline";
      }
      if (dateInput.value.trim() === "") {
        dateError.style.display = "inline";
      }
      checkInputs();
    }
  });

/**
 * Event listener for the click event on the document.
 * Closes the `generatedContatcs` element by removing the "active-task" class
 * if the click occurs outside of the `selectValue` element.
 *
 * @function
 * @param {MouseEvent} e - The click event object containing information about the click event.
 * @returns {void}
 */
document.addEventListener("click", (e) => {
  if (!selectValue.contains(e.target)) {
    generatedContatcs.classList.remove("active-task");
  }
});

/**
 * Event listener for the click event on the `generateList` element.
 * Stops the propagation of the click event to parent elements, preventing
 * any parent click event handlers from being triggered.
 *
 * @function
 * @param {MouseEvent} e - The click event object containing information about the click event.
 * @returns {void}
 */
generateList.addEventListener("click", (e) => {
  e.stopPropagation();
});

/**
 * Event listener for the input event on the element with ID "option-search".
 * Filters the contact list based on the current input value and updates
 * the displayed list of contacts.
 *
 * @function
 * @param {Event} event - The input event object containing details about the user input.
 * @returns {void}
 */
document
  .getElementById("option-search")
  .addEventListener("input", function (event) {
    let searchName = event.target.value;
    let filteredContacts = filterContacts(searchName);
    loadContactList(filteredContacts);
  });

/**
 * Adds a click event listener to each element with the class "contact-item".
 * When a contact item is clicked, updates the value of the `selectValue` input
 * with the text content of the `.contact-text` element within the clicked contact item.
 * Also removes the "active-task" class from the `selectBox` element and
 * calls the `checkInputs` function to perform additional validation or actions.
 *
 * @function
 * @returns {void}
 */
document.querySelectorAll(".contact-item").forEach(function (item) {
  item.addEventListener("click", function () {
    let textDiv = item.querySelector(".contact-text");
    selectValue.value = textDiv.textContent;
    selectBox.classList.remove("active-task");
    checkInputs();
  });
});

/**
 * Event listener for the click event on the `selectCategoryOption` element.
 * Toggles the visibility of the category list when the element is clicked.
 * Prevents the click event from propagating to parent elements.
 *
 * @function
 * @param {MouseEvent} event - The click event object containing details about the click event.
 * @returns {void}
 */
selectCategoryOption.addEventListener("click", function (event) {
  toggleCategoryList();
  event.stopPropagation();
});

/**
 * Event listener for the click event on the `optionSearch` element.
 * Toggles the visibility of the category list when the element is clicked.
 * Prevents the click event from propagating to parent elements.
 *
 * @function
 * @param {MouseEvent} event - The click event object containing details about the click event.
 * @returns {void}
 */
optionSearch.addEventListener("click", function (event) {
  toggleCategoryList();
  event.stopPropagation();
});

/**
 * Event listener for the click event on the document.
 * Closes the category list and resets the dropdown arrow's rotation
 * if the click occurs outside the `selectBoxCategory` element.
 *
 * @function
 * @param {MouseEvent} event - The click event object containing details about the click event.
 * @returns {void}
 */
document.addEventListener("click", function (event) {
  if (!selectBoxCategory.contains(event.target)) {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  }
});

/**
 * Event listener for the click event on the `categoryList` element.
 * Updates the value of the input within the `selectCategoryOption` element
 * with the text content of the clicked list item (LI). Hides the `categoryList`
 * and performs additional validation or actions by calling `checkInputs`.
 *
 * @function
 * @param {MouseEvent} e - The click event object containing details about the click event.
 * @returns {void}
 */
categoryList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    selectCategoryOption.querySelector("input").value = e.target.textContent;
    categoryList.style.display = "none";
    checkInputs();
  }
});

categoryInput.addEventListener("focus", function () {
  checkInputs();
});




function init() {
  includeHTML();
  clearAllInputs();
  getUserLists();
  loadContactList();
  checkInputs();
  selectPriority("Medium");
}

let priorityValue = null;
let kindValue = "";
let kindColor = "";
let selectionState = {};
let contacts = [];
let collaborators = [];
let subtaskArr = [];
let titleInput = document.getElementById("add-title");
let titleError = document.getElementById("title-error");
let textarea = document.getElementById("textarea-task");
let dateInput = document.getElementById("due-date");
let dateError = document.getElementById("date-error");
let createTaskBtn = document.getElementById("add-task-btn");
let clearTaskBtn = document.getElementById("clear-task-btn");
let selectBox = document.querySelector(".select-box");
let selectOption = document.querySelector(".select-option");
let selectValue = document.getElementById("select-value");
let optionSearch = document.getElementById("option-search");
let optionList = document.querySelectorAll(".option li");
let dropDownArrowCat = document.querySelector(".drop-down-arrow-cat");
let selectBoxCategory = document.querySelector(".select-box-category");
let selectCategoryOption = document.getElementById("select-category");
let categoryList = document.getElementById("category-list");
let changedInput = document.getElementById("change-to-focus");
let generatedContatcs = document.getElementById("hide-box");
let generateList = document.getElementById("generate-list");
let inputField = document.getElementById("subtask-input-field");
let categoryInput = document.getElementById("category-value");
let priorityError = document.getElementById("priority-error");
let selectErrorBlock = document.getElementById("select-error-block");
let arrowClick = document.querySelector(".arrow-click");
let hiddenError = document.getElementById("hidden-error");
document
  .getElementById("due-date")
  .setAttribute("min", new Date().toISOString().split("T")[0]);

/**
 * Asynchronously retrieves user data and initializes the application's user-specific information.
 * Fetches user data based on `USER_ID`, sets user initials, and loads the user's contacts and tasks.
 * Updates the UI with the loaded contact list.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves when the user data has been successfully fetched and processed.
 * @throws {Error} - Throws an error if the user data retrieval fails, which is logged to the console.
 */
async function getUserLists() {
  try {
    CURRENT_USER_DATA = await getUserData(USER_ID);
    setUserInitals();
    contacts = CURRENT_USER_DATA.contacts || [];
    tasks = CURRENT_USER_DATA.tasks || [];
    loadContactList();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

/**
 * Clears all input fields, UI elements, and internal states to reset the form or application state.
 * This function performs a complete reset by calling helper functions to handle inputs, UI, and application states.
 *
 * @function
 * @returns {void}
 */
function clearAllInputs() {
  resetInputFields();
  resetUIElements();
  clearAllStates();
}

/**
 * Resets all form input fields to their default values.
 * This function clears the values of input fields, text areas, and selects default options for dropdowns.
 *
 * @function
 * @returns {void}
 */
function resetInputFields() {
  titleInput.value = "";
  textarea.value = "";
  dateInput.value = "";
  selectValue.value = "Select contacts to assign";
  optionSearch.value = "";
  selectCategoryOption.querySelector("input").value = "Select Category";
  priorityValue = null;
}

/**
 * Resets UI elements to their default state.
 * This function hides or resets various UI elements such as dropdowns, error messages, and styling.
 *
 * @function
 * @returns {void}
 */
function resetUIElements() {
  selectBox.classList.remove("active-task");
  categoryList.style.display = "none";
  dropDownArrowCat.style.transform = "rotate(0deg)";
  optionList.forEach((li) => (li.style.display = ""));
  titleError.style.display = "none";
  dateError.style.display = "none";
  titleInput.style.borderBottomColor = "";
  dateInput.style.borderBottomColor = "";
}

/**
 * Clears all internal states related to the form or application.
 * This function resets application states such as subtasks, priorities, collaborators, and selected contacts.
 * It also triggers re-rendering of subtasks and contact lists.
 *
 * @function
 * @returns {void}
 */
function clearAllStates() {
  subtaskArr = [];
  resetPriorityButtons();
  clearCollaborators();
  clearSelectedContacts();
  renderSubtasks();
  loadContactList();
}

/**
 * Resets the priority buttons by removing the "selected-btn" class from all buttons and their associated images.
 * This function is used to clear any visual selection state on the priority buttons, ensuring that none are marked as selected.
 *
 * @function
 * @returns {void}
 */
function resetPriorityButtons() {
  document.querySelectorAll(".buttons button").forEach((btn) => {
    btn.classList.remove("selected-btn");
    btn.querySelector(".button-img").classList.remove("selected-btn");
  });
}

/**
 * Validates input fields and toggles the create task button's state.
 */
function checkInputs() {
  let isTitleValid = titleInput.value.trim() !== "";
  let isDateValid = dateInput.value.trim() !== "";
  let isPrioritySelected = priorityValue !== null;
  let isCategoryValid = ["Technical task", "User story"].includes(
    categoryInput.value
  );

  let allValid =
    isTitleValid && isDateValid && isPrioritySelected && isCategoryValid;
  createTaskBtn.disabled = !allValid;
  createTaskBtn.style.zIndex = allValid ? "0" : "-1";
}

/**
 * Selects a priority button and updates the UI based on the selection.
 *
 * @param {string} priority - The priority level to select (e.g., "High", "Medium", "Low").
 *
 * This function first identifies the button corresponding to the given priority and
 * toggles its selected state. If the button is already selected, it will be deselected.
 * It also updates the error display based on whether a priority has been selected.
 */

function selectPriority(priority) {
  let selectedButton = document.getElementById(priority.toLowerCase());
  let isSelected = selectedButton.classList.contains("selected-btn");
  document.querySelectorAll(".buttons button").forEach((btn) => {
    btn.classList.remove("selected-btn");
    btn.querySelector(".button-img").classList.remove("selected-btn");
  });
  if (!isSelected) {
    selectedButton.classList.add("selected-btn");
    selectedButton.querySelector(".button-img").classList.add("selected-btn");
    priorityValue = priority;
  } else {
    priorityValue = null;
  }
  checkInputs();
}

/**
 * Clears the list of collaborators and resets the selection state.
 * This function empties the `collaborators` array, clears the `selectionState` object,
 * and updates the UI to reflect the cleared collaborator list.
 *
 * @function
 * @returns {void}
 */
function clearCollaborators() {
  collaborators = [];
  selectionState = {};
  renderCollaborators();
}

/**
 * Initializes event handlers for the subtask input field and sets focus on it.
 * This function focuses on the input field, adds event listeners for the `blur` and `keypress` events,
 * and also sets up a document-wide click event listener to handle clicks outside the input field.
 *
 * @function
 * @returns {void}
 */
function handleInputFocusAndEvents() {
  let inputField = document.getElementById("subtask-input-field");
  inputField.focus();
  inputField.addEventListener("blur", function () {
    addSubtaskList();
  });
  inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtaskList();
    }
  });
  document.addEventListener("click", handleClickOutside, true);
}

/**
 * Updates the content of the subtask input field and sets up event handlers for it.
 * This function replaces the inner HTML of the element with the ID `input-subtask-add` with the HTML
 * for the subtask input field and then initializes event handlers and focus management for the input field.
 *
 * @function
 * @returns {void}
 */
function changeToFocus() {
  let changedInput = document.getElementById("input-subtask-add");
  changedInput.innerHTML = getSubtaskInputHTML();
  handleInputFocusAndEvents();
}

/**
 * Adds a new subtask to the list and updates the UI.
 * This function retrieves the value from the subtask input field, creates a new subtask object if the input is not empty,
 * assigns a unique ID, and adds it to the `subtaskArr` array. After adding the subtask, it clears the input field
 * and calls `renderSubtasks` to update the display. If the input is empty, it calls `clearInputSubtask` to handle the empty case.
 *
 * @function
 * @returns {void}
 */
function addSubtaskList() {
  let subtaskInput = document.getElementById("subtask-input-field").value;
  if (subtaskInput.trim() !== "") {
    let uniqueId = Number(Date.now().toString());
    let newSubtask = {
      name: subtaskInput,
      id: uniqueId,
      state: "open",
    };
    subtaskArr.push(newSubtask);
    document.getElementById("subtask-input-field").value = "";
    renderSubtasks();
  } else {
    clearInputSubtask();
  }
}

/**
 * Handles clicks outside of the subtask input field to clear the input and remove the click event listener.
 * This function checks if the click event occurred outside the element with the ID `subtask-input-wrapper`.
 * If so, it clears the subtask input field and removes the document-wide click event listener that invoked this function.
 *
 * @function
 * @param {Event} event - The click event object representing the user's click action.
 * @returns {void}
 */
function handleClickOutside(event) {
  let inputWrapper = document.getElementById("subtask-input-wrapper");
  if (inputWrapper && !inputWrapper.contains(event.target)) {
    clearInputSubtask();
    document.removeEventListener("click", handleClickOutside, true);
  }
}

/**
 * Reveals the icons inside the element that triggered the event.
 * This function is intended to be used as an event handler for mouse enter events.
 * It locates the child element with the class `subtask-add-icons` and removes
 * the `d-none` class to make it visible.
 *
 * @function
 * @param {Event} event - The mouse enter event object, representing the user's interaction.
 * @returns {void}
 */
function showIcons(event) {
  let icons = event.currentTarget.querySelector(".subtask-add-icons");
  if (icons) {
    icons.classList.remove("d-none");
  }
}

/**
 * Hides the icons inside the element that triggered the event.
 * This function is intended to be used as an event handler for mouse leave events.
 * It locates the child element with the class `subtask-add-icons` and adds
 * the `d-none` class to hide it from view.
 *
 * @function
 * @param {Event} event - The mouse leave event object, representing the user's interaction.
 * @returns {void}
 */
function hideIcons(event) {
  let icons = event.currentTarget.querySelector(".subtask-add-icons");
  if (icons) {
    icons.classList.add("d-none");
  }
}

/**
 * Adds mouse hover event listeners to elements with the class `input-positioning-subtask`.
 * The event listeners handle showing and hiding icons based on mouse interactions.
 * - On `mouseenter`, the `showIcons` function is called to display the icons.
 * - On `mouseleave`, the `hideIcons` function is called to hide the icons.
 *
 * @function
 * @returns {void}
 */
function addHoverEventListeners() {
  let taskDivs = document.querySelectorAll(".input-positioning-subtask");
  taskDivs.forEach(function (taskDiv) {
    taskDiv.addEventListener("mouseenter", showIcons);
    taskDiv.addEventListener("mouseleave", hideIcons);
  });
}

/**
 * Adds event listeners to the subtask input field associated with the given task.
 * Specifically, it attaches a `dblclick` event listener to the subtask input field for the provided task ID.
 * When a double-click event occurs on the input field, the `editSubtask` function is called with the task ID.
 *
 * @function
 * @param {Object} task - The task object for which the subtask input field event listener is being added.
 * @param {number} task.id - The unique identifier for the task, used to target the specific subtask input field.
 * @returns {void}
 */

/**
 * Renders all subtasks by generating their HTML and adding necessary event listeners.
 * Updates the inner HTML of the element with ID 'added-subtask'.
 */
function renderSubtasks() {
  let addedSubtask = document.getElementById("added-subtask");
  addedSubtask.innerHTML = subtaskArr
    .map((task) => generateSubtaskHTML(task))
    .join("");
  subtaskArr.forEach((task) => addSubtaskEventListeners(task));
  addHoverEventListeners();
}

/**
 * Adds event listeners to a subtask for handling specific interactions.
 * Currently, it adds a click event listener for editing the subtask.
 *
 * @param {Object} task - The subtask object containing task details.
 * @param {number} task.id - The unique identifier for the subtask.
 */
function addSubtaskEventListeners(task) {
  document
    .getElementById(`subtask-input-field-sub-${task.id}`)
    .addEventListener("click", () => editSubtask(task.id));
}

/**
 * Disables the ability to click and shows error messages.
 * This function sets the display style of error elements to 'block',
 * making them visible to the user.
 */
function disabledClick() {
  priorityError.style.display = "block";
}

/**
 * Disables the ability to click and shows error messages.
 * This function sets the display style of error elements to 'block',
 * making them visible to the user.
 */
function disabledClick2() {
  selectErrorBlock.style.display = "block";
}

/**
 * Disables the ability to click and shows error messages.
 * This function sets the display style of error elements to 'block',
 * making them visible to the user.
 */
function disabledClick3() {
  titleError.style.display = "block";
}

/**
 * Enables the task creation button and hides error messages.
 * This function makes the createTaskBtn clickable by setting its
 * 'disabled' property to false and hides error elements by setting
 * their display style to 'none'.
 */
function enableCreateTaskBtnAndShowErrors() {
  createTaskBtn.disabled = false;
  priorityError.style.display = "none";
  selectErrorBlock.style.display = "none";
}

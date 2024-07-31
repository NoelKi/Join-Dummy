/**
 * Enables editing mode for a subtask with the specified ID.
 * This function locates the subtask element, input field, and icon elements based on the provided ID.
 * It then makes the subtask editable and sets up the necessary input events for user interactions.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be edited.
 * @returns {void}
 */
function editSubtask(id) {
  let subTaskDiv = document.getElementById("input-positioning-" + id);
  let inputField = document.getElementById(`subtask-input-field-sub-${id}`);
  let showIcons = document.getElementById("d-none-" + id);
  makeEditable(subTaskDiv, showIcons, inputField);
  setupInputEvents(id, inputField);
}

/**
 * Configures the provided subtask element to be editable.
 * This function sets the subtask element to an editable state by adding a CSS class,
 * showing the icons associated with the subtask, and making the input field interactive.
 * It also focuses the input field to allow immediate user input.
 *
 * @function
 * @param {HTMLElement} subTaskDiv - The container element for the subtask to be made editable.
 * @param {HTMLElement} showIcons - The element containing icons related to the subtask, which should be made visible.
 * @param {HTMLElement} inputField - The input field element that will be used for editing the subtask.
 * @returns {void}
 */
function makeEditable(subTaskDiv, showIcons, inputField) {
  subTaskDiv.classList.add("editable");
  showIcons.classList.remove("d-none");
  inputField.removeAttribute("readonly");
  inputField.focus();
}

/**
 * Sets up event listeners for the provided input field associated with a subtask.
 * This function adds a `blur` event listener to handle when the input field loses focus,
 * and a `keypress` event listener to handle user keypresses, such as the Enter key.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask, used to identify which subtask is being edited.
 * @param {HTMLElement} inputField - The input field element where subtask editing occurs.
 * @returns {void}
 */
function setupInputEvents(id, inputField) {
  inputField.addEventListener("blur", function () {
    handleBlurEvent(id, inputField);
  });
  inputField.addEventListener("keypress", function (event) {
    handleKeyPressEvent(event, inputField);
  });
}

/**
 * Handles the blur event for an input field by updating the subtask with the new value.
 * When the input field loses focus, this function attempts to update the subtask with the provided ID.
 * If an error occurs during the update, an alert is displayed with the error message, and the input field is refocused.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask being updated.
 * @param {HTMLElement} inputField - The input field element containing the new value for the subtask.
 * @returns {void}
 * @throws {Error} If an error occurs during the update process, an alert is shown and the input field is refocused.
 */
function handleBlurEvent(id, inputField) {
  try {
    updateSubtask(id, inputField.value);
  } catch (error) {
    alert(error.message);
    inputField.focus();
  }
}

/**
 * Handles the keypress event for an input field by checking for the Enter key.
 * If the Enter key is pressed, this function triggers a blur event on the input field,
 * which typically causes the input field to lose focus and any associated blur event handlers to execute.
 *
 * @function
 * @param {KeyboardEvent} event - The keypress event triggered by the user.
 * @param {HTMLElement} inputField - The input field element that is being monitored for keypress events.
 * @returns {void}
 */
function handleKeyPressEvent(event, inputField) {
  if (event.key === "Enter") {
    inputField.blur();
  }
}

/**
 * Updates the value of a subtask identified by the given ID.
 * This function trims the input value, removes any leading bullet points,
 * and then updates or removes the subtask using the `findAndUpdateOrRemoveSubtask` function.
 * After updating, it re-renders the list of subtasks to reflect the changes.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be updated.
 * @param {string} newValue - The new value to set for the subtask, which is trimmed and formatted.
 * @returns {void}
 */
function updateSubtask(id, newValue) {
  newValue = newValue.trim();
  let bulletPattern = /^•\s*/;
  if (bulletPattern.test(newValue)) {
    newValue = newValue.replace(bulletPattern, "");
  }
  findAndUpdateOrRemoveSubtask(id, newValue);
  renderSubtasks();
}

/**
 * Finds a subtask by its ID and either updates its name or removes it from the list.
 * If the `newValue` is an empty string, the subtask with the matching ID is removed from the `subtaskArr` array.
 * Otherwise, the subtask's name is updated with the provided `newValue`.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be updated or removed.
 * @param {string} newValue - The new value to set for the subtask. If an empty string is provided, the subtask is removed.
 * @returns {void}
 */
function findAndUpdateOrRemoveSubtask(id, newValue) {
  if (newValue === "") {
    for (let i = 0; i < subtaskArr.length; i++) {
      if (subtaskArr[i].id === id) {
        subtaskArr.splice(i, 1);
        break;
      }
    }
  } else {
    for (let i = 0; i < subtaskArr.length; i++) {
      if (subtaskArr[i].id === id) {
        subtaskArr[i].name = newValue;
        break;
      }
    }
  }
}

/**
 * Removes a subtask from the list based on its unique identifier.
 * This function filters out the subtask with the specified `id` from the `subtaskArr` array
 * and then re-renders the list of subtasks to reflect the removal.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be removed.
 * @returns {void}
 */
function removeSubtask(id) {
  subtaskArr = subtaskArr.filter((task) => task.id !== id);
  renderSubtasks();
}

/**
 * Clears the value of the subtask input field.
 * This function sets the value of the input field with the ID 'subtask-input-field' to an empty string,
 * effectively clearing any text entered by the user.
 *
 * @function
 * @returns {void}
 */
function clearInputSubtask() {
  document.getElementById("subtask-input-field").value = "";
}

/**
 * Toggles the visibility of the category list and rotates the dropdown arrow.
 * This function checks the current display style of the category list. If it is set to "block",
 * it hides the list and resets the arrow rotation. If it is set to "none", it shows the list
 * and rotates the arrow to indicate the expanded state.
 *
 * @function
 * @returns {void}
 */
function toggleCategoryList() {
  if (categoryList.style.display === "block") {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  } else {
    categoryList.style.display = "block";
    dropDownArrowCat.style.transform = "rotate(180deg)";
  }
}

/**
 * Extracts the first letter from a given name and converts it to uppercase.
 * This function takes a string representing a name, extracts the first character, and
 * returns it in uppercase format. It is useful for generating initials or displaying the
 * first letter of a name.
 *
 * @function
 * @param {string} name - The name from which to extract the first letter.
 * @returns {string} The uppercase first letter of the provided name.
 */
function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}

/**
 * Adds a new task to the `tasks` array with the current input values and properties.
 * This function creates a new task object with various attributes including an ID, date,
 * title, kind, color, description, category, priority, collaborators, and subtasks.
 * The new task is then appended to the `tasks` array.
 *
 * @function
 * @returns {void}
 */
function pushTaskToTasks(category = "toDo") {
  // Add a new task object to the tasks array
  tasks.push({
    id: Date.now().toString(),
    date: dateInput.value,
    title: titleInput.value,
    kind: kindValue,
    taskColor: kindColor,
    description: textarea.value,
    category: category,
    priority: priorityValue,
    collaborators: collaborators,
    subtask: subtaskArr,
  });
}

/**
 * Sets the task kind and its associated color based on the provided kind identifier.
 * This function updates the `kindValue` and `kindColor` variables according to the kind identifier.
 * The function supports specific kinds of tasks such as "Technical task" and "User Story", each with a unique color.
 *
 * @function
 * @param {string} kind - The identifier for the kind of task. Can be "TT" for Technical task or "US" for User Story.
 * @returns {void}
 */
function setTaskKind(kind) {
  if (kind === "TT") {
    kindColor = "#0038FF";
    kindValue = "Technical task";
  }
  if (kind === "US") {
    kindColor = "#FF7A00";
    kindValue = "User Story";
  }
}

/**
 * Clears the current task kind settings by resetting `kindColor` and `kindValue`.
 * This function is used to remove any previously set kind and its associated color,
 * effectively resetting these properties to their default empty values.
 *
 * @function
 * @returns {void}
 */
function clearTaskKind() {
  kindColor = ""; // Reset the color associated with the task kind
  kindValue = ""; // Reset the description of the task kind
}

/**
 * Handles the task creation process when a form is submitted.
 * This function prevents the default form submission, adds the new task to the `tasks` array,
 * updates the user data with the new task list, disables the task creation button, and clears
 * all input fields after a short delay. Additionally, it triggers an animation to indicate the
 * successful creation of the task.
 *
 * @function
 * @param {Event} event - The event object representing the form submission event.
 * @returns {void}
 */
function createTask(event) {
  event.preventDefault();
  pushTaskToTasks(CAT);
  updateUser(
    CURRENT_USER_DATA.name,
    CURRENT_USER_DATA.email,
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks
  );
  setTimeout(() => {
    clearAllInputs();
  }, 0);
  showAnimation();
}

/**
 * Displays an animation to indicate a successful task creation.
 * This function makes an animation element visible, triggers a CSS animation by adding a class,
 * then hides the animation element and redirects the user to the 'board.html' page.
 *
 * The animation is displayed by setting its `display` style to `flex`, and the CSS class `show`
 * is added to trigger the animation effect. After a short delay, the class is removed, and the
 * element is hidden again. Finally, the user is redirected to the 'board.html' page.
 *
 * @function
 * @returns {void}
 */
function showAnimation() {
  let animationDiv = document.getElementById("added-animation");
  animationDiv.style.display = "flex";
  setTimeout(function () {
    animationDiv.classList.add("show");
  }, 10);

  setTimeout(function () {
    animationDiv.classList.remove("show");
    setTimeout(function () {
      animationDiv.style.display = "none";
      window.location.href = "board.html";
    }, 500);
  }, 1000);
}

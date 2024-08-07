/**
 * Toggles the state of a subtask between "done" and "open".
 * @param {string} taskId - The ID of the parent task.
 * @param {string} subtaskId - The ID of the subtask.
 */
function switchSubtaskState(taskId, subtaskId) {
  const object = getObjectById(tasks, `${taskId}`);
  const subtask = getObjectById(object.subtask, subtaskId);
  if (subtask.state === "done") {
    subtask.state = "open";
  } else {
    subtask.state = "done";
  }
  renderTaskOverlay(taskId);
  renderTasks(object);
}

/**
 * Gets the index of an object by its ID in an array.
 * @param {Array} arr - The array to search.
 * @param {string} id - The ID of the object.
 * @returns {number} The index of the object with the specified ID, or -1 if not found.
 */
function getIndexById(arr, id) {
  if (!arr || arr.length === 0) {
    return -1;
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
  return -1;
}

/**
 * Deletes a task by its ID.
 * @param {string} id - The ID of the task to delete.
 */
function deleteTask(id) {
  const taskIndex = getIndexById(tasks, `${id}`);
  tasks.splice(taskIndex, 1);
  updateUser(
    CURRENT_USER_DATA.name,
    CURRENT_USER_DATA.email,
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks
  );
  renderTasks();
  closeTaskOverlay();
}

/**
 * Deletes a task by its ID for editing purposes.
 * @param {string} id - The ID of the task to delete.
 */
function deleteTaskForEdit(id) {
  const taskIndex = getIndexById(tasks, `${id}`);
  tasks.splice(taskIndex, 1);
  updateUser(
    CURRENT_USER_DATA.name,
    CURRENT_USER_DATA.email,
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks
  );
  renderTasks();
  closeTaskOverlay();
}

/**
 * Closes the contact detail card.
 */
function closeContactDetailCard() {
  const content = (document.getElementsByClassName(
    "contact-detail-section"
  ).style.display = "none");
}

/**
 * Finds an object by ID in an array
 * @param {Array} array - The array to search in
 * @param {number} id - The ID of the object to find
 * @returns {Object} The object with the specified ID
 */
function getObjectById(array, id) {
  return array.find((obj) => obj.id === id);
}
/**
 * Filters tasks based on the search input.
 * @param {Event} event - The input event containing the search value.
 */
function filterTasks(event) {
  const search = event.target.value.toLowerCase();
  let counterTo = 0;
  const content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    const element = array[i];
  }
}

/**
 * Closes the edit task overlay.
 */
function closeEditTaskOverlay() {
  const content = document.getElementById("edit-task-board-overlay");
  content.style.display = "none";
  editId = null;
}

/**
 * Opens the edit task overlay for a specific task.
 * @param {string} id - The ID of the task to edit.
 */
function openEditTaskOverlay(id) {
  closeTaskOverlay();
  const content = document.getElementById("edit-task-board-overlay");
  content.style.display = "block";
  showEditableTask(id);
}

/**
 * Displays the editable task details in the edit overlay.
 * @param {string} id - The ID of the task to show.
 */
function showEditableTask(id) {
  task = getObjectById(tasks, `${id}`);
  setTaskCategory(task);
  setTitle(task.title);
  setDate(task.date);
  setDescription(task.description);
  setPriority(task.priority);
  collaborators = task.collaborators || [];
  renderCollaborators();
  setHighlight();
  setSubtasks(task);
}

/**
 * Sets the task category in the edit form.
 * @param {Object} task - The task object.
 */
function setTaskCategory(task) {
  categoryInput.value = task.kind;
  kindValue = task.kind;
  kindColor = task.taskColor;
}

/**
 * Sets the task title in the edit form.
 * @param {string} title - The task title.
 */
function setTitle(title) {
  document.getElementById("add-title").value = title;
}

/**
 * Sets the task due date in the edit form.
 * @param {string} date - The task due date.
 */
function setDate(date) {
  document.getElementById("due-date").value = date;
}

/**
 * Sets the task description in the edit form.
 * @param {string} description - The task description.
 */
function setDescription(description) {
  document.getElementById("textarea-task").value = description;
}

/**
 * Sets the task priority in the edit form.
 * @param {string} priority - The task priority.
 */
function setPriority(priority) {
  switch (priority) {
    case "Urgent":
      document.getElementById("urgent").classList.add("selected-btn");
      priorityValue = "Urgent";
      break;
    case "Medium":
      document.getElementById("medium").classList.add("selected-btn");
      priorityValue = "Medium";
      break;
    case "Low":
      document.getElementById("low").classList.add("selected-btn");
      priorityValue = "Low";
      break;
  }
}

/**
 * Highlights the collaborators in the edit form.
 */
function setHighlight() {
  const elements = document.querySelectorAll(".contact-task-assign");
  const collaboratorIds = setTaskCollaboratorIds();
  elements.forEach((element) => {
    if (collaboratorIds.includes(String(element.getAttribute("data-id")))) {
      element.classList.add("selected");
      const imgElement = element.querySelector(".check-box-task img");
      if (imgElement) imgElement.src = "../assets/img/checkedTaskHtml.svg";
    }
  });
}

/**
 * Sets the IDs of the task collaborators.
 * @returns {Array} The array of collaborator IDs.
 */
function setTaskCollaboratorIds() {
  const collaboratorIds = [];
  for (const collab in collaborators) {
    if (Object.hasOwnProperty.call(collaborators, collab)) {
      const element = collaborators[collab];
      collaboratorIds.push(String(element.id));
    }
  }
  return collaboratorIds;
}

/**
 * Sets the subtasks in the edit form.
 * @param {Object} task - The task object.
 */
function setSubtasks(task) {
  let subtaskField = document.getElementById("added-subtask");
  if (task.subtask) {
    subtaskArr = task.subtask;
    for (const subtask in subtaskArr) {
      if (Object.hasOwnProperty.call(subtaskArr, subtask)) {
        const element = subtaskArr[subtask];
        subtaskField.innerHTML += generateSubtaskHTML(element);
      }
    }
  } else subtaskArr = null;
  addHoverEventListeners();
}

/**
 * Updates the task with the edited details.
 */
function updateTask() {
  const content = document.getElementById("edit-task-board-overlay");
  const currTaskId = content.getAttribute("currTaskId");
  const indexOld = getIndexById(tasks, currTaskId);
  pushEditedTaskToTasks(CAT, indexOld);
  updateUser(
    CURRENT_USER_DATA.name,
    CURRENT_USER_DATA.email,
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks
  );
  returnEditTaskElementToAdd();
  clearAllInputs();
  closeEditTaskOverlay();
  renderTasks();
}

/**
 * Pushes the edited task details to the tasks array.
 * @param {string} [category="toDo"] - The category of the task.
 * @param {number} index - The index of the task in the array.
 */
function pushEditedTaskToTasks(category = "toDo", index) {
  tasks.splice(index, 1, {
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
 * Renders the edit task overlay for a specific task.
 * @param {string} id - The ID of the task to edit.
 */
function renderEditTaskOverlay(id) {
  closeTaskOverlay();
  moveAddTaskElementToEdit();
  const content = document.getElementById("edit-task-board-overlay");
  content.style.display = "block";
  content.setAttribute("currTaskId", id);
  showEditableTask(id);
}

/**
 * Moves the add task element to the edit overlay.
 */
function moveAddTaskElementToEdit() {
  const showTaskEditOverlay = document.getElementsByClassName(
    "show-task-container-edit"
  )[0];
  const addEditForm = document.getElementById("task-form");
  showTaskEditOverlay.prepend(addEditForm);
  const createBtn = document.getElementsByClassName("create-button-overlay")[0];
  createBtn.style.display = "none";
  const okBtn = document.getElementsByClassName("ok-btn-container")[0];
  okBtn.style.display = "";
}

/**
 * Returns the edit task element to the add task overlay.
 */
function returnEditTaskElementToAdd() {
  const showTaskEditOverlay =
    document.getElementsByClassName("add-task-container")[0];
  const addEditForm = document.getElementById("task-form");
  showTaskEditOverlay.prepend(addEditForm);
  const createBtn = document.getElementsByClassName("create-button-overlay")[0];
  createBtn.style.display = "flex";
  const okBtn = document.getElementsByClassName("ok-btn-container")[0];
  okBtn.style.display = "none";
}

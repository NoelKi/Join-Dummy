/**
 * Initializes the board on window load.
 */
window.onload = function () {
  includeHTML();
  getUserBoard();
  renderTasks();
  checkInputs();
};

let currentTaskElement;
let currentDraggedElement;
let tasks = [];

/**
 * Fetches user board data and sets up the user interface.
 */
async function getUserBoard() {
  try {
    CURRENT_USER_DATA = await getUserData(USER_ID);
    setUserInitals();
    setUserListsBoard();
    loadContactList();
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}

/**
 * Sets the user's contact and task lists on the board.
 */
function setUserListsBoard() {
  if (!CURRENT_USER_DATA.contacts) {
    contacts = [];
  } else {
    contacts = CURRENT_USER_DATA.contacts;
  }
  if (!CURRENT_USER_DATA.tasks) {
    tasks = [];
  } else {
    tasks = CURRENT_USER_DATA.tasks;
    renderTasks();
  }
}

/**
 * Renders tasks on the board based on search input.
 */
function renderTasks() {
  const searchValue =
    document.getElementsByClassName("searchbar-board")[0].value;
  const filterTask = searchValue
    ? tasks.filter(
        (t) =>
          t["title"].includes(searchValue) ||
          t["description"].includes(searchValue)
      )
    : tasks;
  renderToDo(filterTask);
  renderInProgress(filterTask);
  renderAwaitFeedback(filterTask);
  renderDone(filterTask);
}

/**
 * Renders tasks in the "To Do" category.
 * @param {Array} tasks - The tasks to render.
 */
function renderToDo(tasks) {
  let toDo = tasks.filter((t) => t["category"] == "toDo");

  document.getElementById("toDo").innerHTML = "";

  for (let index = 0; index < toDo.length; index++) {
    const element = toDo[index];
    document.getElementById("toDo").innerHTML += renderTaskHtml(element);
  }
  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML = createEmptyBox("to do");
  }
}

/**
 * Renders tasks in the "Await Feedback" category.
 * @param {Array} tasks - The tasks to render.
 */
function renderAwaitFeedback(tasks) {
  let awaitFeedback = tasks.filter((t) => t["category"] == "awaitFeedback");

  document.getElementById("awaitFeedback").innerHTML = "";

  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById("awaitFeedback").innerHTML +=
      renderTaskHtml(element);
  }
  if (awaitFeedback.length === 0) {
    document.getElementById("awaitFeedback").innerHTML =
      createEmptyBox("await feedback");
  }
}

/**
 * Renders tasks in the "Done" category.
 * @param {Array} tasks - The tasks to render.
 */
function renderDone(tasks) {
  let done = tasks.filter((t) => t["category"] == "done");

  document.getElementById("done").innerHTML = "";

  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById("done").innerHTML += renderTaskHtml(element);
  }
  if (done.length === 0) {
    document.getElementById("done").innerHTML = createEmptyBox("done");
  }
}

/**
 * Renders tasks in the "In Progress" category.
 * @param {Array} tasks - The tasks to render.
 */
function renderInProgress(tasks) {
  let inProgress = tasks.filter((t) => t["category"] == "inProgress");

  document.getElementById("inProgress").innerHTML = "";

  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById("inProgress").innerHTML += renderTaskHtml(element);
  }
  if (inProgress.length === 0) {
    document.getElementById("inProgress").innerHTML =
      createEmptyBox("in progress");
  }
}

/**
 * Starts the dragging process for a task.
 * @param {string} id - The ID of the task to be dragged.
 * @param {Event} event - The drag event.
 */
function startDragging(id, event) {
  currentTaskElement = getIndexById(tasks, `${id}`);
  currentDraggedElement = event.target;
}

/**
 * Allows the drop event to happen.
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a new category.
 * @param {string} category - The new category for the task.
 */
function moveTo(category) {
  tasks[currentTaskElement]["category"] = category;
  renderTasks();
}

/**
 * Checks if an element is before another element in the DOM.
 * @param {Element} el1 - The first element.
 * @param {Element} el2 - The second element.
 * @returns {boolean} True if el1 is before el2, false otherwise.
 */
function isBefore(el1, el2) {
  if (el2.parentNode === el1.parentNode)
    for (
      let cur = el1.previousSibling;
      cur && cur.nodeType !== 9;
      cur = cur.previousSibling
    )
      if (cur === el2) return true;
  return false;
}

/**
 * Handles the dragover event for dragging tasks.
 * @param {Event} e - The dragover event.
 */
function dragOver(e) {
  if (isBefore(currentDraggedElement, e.currentTarget)) {
    e.currentTarget.parentNode.insertBefore(
      currentDraggedElement,
      e.currentTarget
    );
  } else {
    e.currentTarget.parentNode.insertBefore(
      currentDraggedElement,
      e.currentTarget.nextSibling
    );
  }
}

/**
 * Handles the drop event for dropping tasks.
 * @param {Event} event - The drop event.
 */
function drop(event) {
  const category = event.currentTarget.id;
  if (category !== tasks[currentTaskElement]["category"]) {
    dropDifferentCategory(event, category);
  } else {
    dropSameCategory(event);
  }
  updateUser(
    CURRENT_USER_DATA.name,
    CURRENT_USER_DATA.email,
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks
  );
}

/**
 * Handles dropping a task within the same category.
 * @param {Event} event - The drop event.
 */
function dropSameCategory(event) {
  const array = event.currentTarget.children;
  const idList = [];
  const newTasks = [];
  for (let i = 0; i < array.length; i++) {
    const elId = array[i].id;
    const currIndex = getIndexById(tasks, elId);
    const taskObj = tasks[currIndex];
    newTasks.push(taskObj);
  }
  tasks = newTasks;
  removeHighlight(event);
  renderTasks();
  currentDraggedElement = null;
}

/**
 * Handles dropping a task into a different category.
 * @param {Event} event - The drop event.
 * @param {string} category - The new category for the task.
 */
function dropDifferentCategory(event, category) {
  tasks[currentTaskElement]["category"] = category;
  removeHighlight(event);
  renderTasks();
  currentDraggedElement = null;
}

/**
 * Highlights the drop area during a drag event.
 * @param {Event} event - The dragenter event.
 */
function highlight(event) {
  event.currentTarget.classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from the drop area after a drag event.
 * @param {Event} event - The dragleave event.
 */
function removeHighlight(event) {
  event.currentTarget.classList.remove("drag-area-highlight");
}

/**
 * Renders the collaborator initials.
 * @param {string} id - The ID of the task.
 */
function renderCollabInitials(id) {
  const content = document.getElementById(`task-collaborators-${id}`);
}

/**
 * Gets the first letter of a name and converts it to uppercase.
 * @param {string} name - The name to get the first letter from.
 * @returns {string} The first letter of the name in uppercase.
 */
function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}

/**
 * Closes the overlay section.
 */
function closeOverlay() {
  const content = document.getElementById("board-overlay-section");
  content.style.display = "none";
}

/**
 * Closes the task overlay section.
 */
function closeTaskOverlay() {
  const content = document.getElementById("board-task-overlay-section");
  content.style.display = "none";
}

/**
 * Renders the add task overlay.
 * @param {string} [category="toDo"] - The category of the task.
 */
function renderAddTaskOverlay(category = "toDo") {
  CAT = category;
  const content = document.getElementById("board-overlay-section");
  content.style.display = "block";
}

/**
 * Renders the task overlay for a specific task.
 * @param {string} id - The ID of the task.
 */
function renderTaskOverlay(id) {
  const element = getObjectById(tasks, `${id}`);
  const content = document.getElementById("board-task-overlay-section");
  content.style.display = "block";
  content.innerHTML = createTaskOverlay(element, id);
}

/**
 * Gets an object by its ID from an array.
 * @param {Array} array - The array to search.
 * @param {string} id - The ID of the object.
 * @returns {Object} The object with the specified ID.
 */
function getObjectById(array, id) {
  return array.find((obj) => obj.id === id);
}

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

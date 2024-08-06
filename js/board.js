window.onload = function () {
  includeHTML();
  getUserBoard();
  renderTasks();
  checkInputs();
};

let currentTaskElement;
let currentDraggedElement;
let tasks = [];

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

function startDragging(id, event) {
  currentTaskElement = getIndexById(tasks, `${id}`);
  currentDraggedElement = event.target;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  tasks[currentTaskElement]["category"] = category;
  renderTasks();
}

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

function dragOver(e) {
  if (isBefore(currentDraggedElement, e.currentTarget)) {
    e.currentTarget.parentNode.insertBefore(
      currentDraggedElement,
      e.currentTarget
    );
  } else
    e.currentTarget.parentNode.insertBefore(
      currentDraggedElement,
      e.currentTarget.nextSibling
    );
}

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

function dropDifferentCategory(event, category) {
  tasks[currentTaskElement]["category"] = category;
  removeHighlight(event);
  renderTasks();
  currentDraggedElement = null;
}

function highlight(event) {
  event.currentTarget.classList.add("drag-area-highlight");
}

function removeHighlight(event) {
  event.currentTarget.classList.remove("drag-area-highlight");
}

function renderCollabInitials(id) {
  const content = document.getElementById(`task-collaborators-${id}`);
}

function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}

function closeOverlay() {
  const content = document.getElementById("board-overlay-section");
  content.style.display = "none";
}

function closeTaskOverlay() {
  const content = document.getElementById("board-task-overlay-section");
  content.style.display = "none";
}

function renderAddTaskOverlay(category = "toDo") {
  CAT = category;
  const content = document.getElementById("board-overlay-section");
  content.style.display = "block";
}

function renderTaskOverlay(id) {
  const element = getObjectById(tasks, `${id}`);
  const content = document.getElementById("board-task-overlay-section");
  content.style.display = "block";
  content.innerHTML = createTaskOverlay(element, id);
}

function getObjectById(array, id) {
  return array.find((obj) => obj.id === id);
}

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

function filterTasks(event) {
  const search = event.target.value.toLowerCase();
  let counterTo = 0;
  const content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    const element = array[i];
  }
}

function filterNames(event) {
  const search = event.target.value.toLowerCase();
  let counterTo = 0;
  const content = document.getElementById("content");
  content.innerHTML = "";
  hideLoadButton();
  for (let index = 0; index < names.length; index++) {
    let name = names[index];
    name = name.toLowerCase();
    if (name.includes(search)) {
      content.innerHTML += createCardHtml(index);
      counterTo += 1;
    }
  }
  if (counterTo === names.length) {
    showLoadButton();
  }
}

function closeEditTaskOverlay() {
  const content = document.getElementById("edit-task-board-overlay");
  content.style.display = "none";
  editId = null;
}

function openEditTaskOverlay(id) {
  closeTaskOverlay();
  const content = document.getElementById("edit-task-board-overlay");
  content.style.display = "block";
  showEditableTask(id);
}

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

function setTaskCategory(task) {
  categoryInput.value = task.kind;
  kindValue = task.kind;
  kindColor = task.taskColor;
}

function setTitle(title) {
  document.getElementById("add-title").value = title;
}

function setDate(date) {
  document.getElementById("due-date").value = date;
}

function setDescription(description) {
  document.getElementById("textarea-task").value = description;
}

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

function pushEditedTaskToTasks(category = "toDo", index) {
  // Add a new task object to the tasks array
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

function renderEditTaskOverlay(id) {
  closeTaskOverlay();
  moveAddTaskElementToEdit();
  const content = document.getElementById("edit-task-board-overlay");
  content.style.display = "block";
  content.setAttribute("currTaskId", id);
  showEditableTask(id);
}

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

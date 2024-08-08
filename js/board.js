/**
 * Initializes the board on window load.
 */
window.onload = function () {
  includeHTML();
  getUserBoard();
  renderTasks();
  checkInputs();
};

let currentTaskElement = null;
let currentDraggedElement = null;
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

  addTouchEventListeners();
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
  console.log(currentTaskElement);
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

// Funktion zum Hinzufügen von Touch-Event-Listenern
function addTouchEventListeners() {
  const draggableItems = document.querySelectorAll(".task-container.draggable");
  draggableItems.forEach((item) => {
    item.addEventListener("touchstart", handleTouchStart, false);
    item.addEventListener("touchmove", handleTouchMove, false);
    item.addEventListener("touchend", handleTouchEnd, false);
  });
}

// Funktion zum Behandeln des Touch-Start-Events
function handleTouchStart(event) {
  touchElement = event.target.closest(".task-container");
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  console.log("touchStart");

  // Berechnung der Anfangsposition des Elements relativ zur Touch-Position
  const rect = touchElement.getBoundingClientRect();
  elementStartX = rect.left;
  elementStartY = rect.top;
  console.log("touchStart");
}

// Funktion zum Behandeln des Touch-Move-Events
function handleTouchMove(event) {
  event.preventDefault();
  const touch = event.touches[0];
  touchElement.style.position = "absolute";
  touchElement.style.left = `${touch.clientX - touchStartX}px`;
  touchElement.style.top = `${touch.clientY - touchStartY}px`;
  console.log("Penis");
}

// Funktion zum Behandeln des Touch-End-Events
function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const dropTarget = document.elementFromPoint(touchEndX, touchEndY);

  if (dropTarget && dropTarget.classList.contains("drag-area")) {
    const category = dropTarget.id;
    console.log(category);
    moveTo(category);
  }

  touchElement.style.position = "static";
}

let touchStartX = 0,
  touchStartY = 0,
  elementStartX = 0,
  elementStartY = 0,
  touchElement;

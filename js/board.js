console.log(dragula); // Fügt dies zu Beginn deiner board.js hinzu.

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
  console.log("gerednert");
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

document.addEventListener("DOMContentLoaded", function () {
  const containers = [
    document.getElementById("toDo"),
    document.getElementById("inProgress"),
    document.getElementById("awaitFeedback"),
    document.getElementById("done"),
  ];

  // Funktion zum Überprüfen und Hinzufügen eines Platzhalters
  function updatePlaceholders() {
    containers.forEach((container) => {
      const hasItems = container.querySelector(".task-container"); // Prüft, ob der Container Elemente hat
      let placeholder = container.querySelector(".empty-box");

      if (!hasItems && !placeholder) {
        // Wenn keine Elemente vorhanden sind und noch kein Platzhalter da ist, füge den Platzhalter hinzu
        container.innerHTML = createEmptyBox("here");
      } else if (hasItems && placeholder) {
        // Wenn Elemente vorhanden sind und ein Platzhalter existiert, entferne den Platzhalter
        placeholder.remove();
      }
    });
  }

  const drake = dragula(containers);

  // Event, das ausgelöst wird, wenn ein Element zu ziehen beginnt
  drake.on("drag", function (el) {
    // Hier kannst du die ID der Aufgabe und das zu ziehende Element erfassen
    const taskId = el.getAttribute("id");
    if (taskId) {
      startDragging(taskId, el);
    }
  });

  // Funktion zum Handhaben des Drop-Events
  function dropHandler(el, target) {
    console.log("nase");
    updateUser(
      CURRENT_USER_DATA.name,
      CURRENT_USER_DATA.email,
      CURRENT_USER_DATA.password,
      CURRENT_USER_DATA.contacts,
      tasks
    );

    console.log("userUpdate");
  }

  // Event, das ausgelöst wird, wenn ein Element fallen gelassen wird
  drake.on("drop", function (el, target, source, sibling) {
    let newCategory;

    if (target.id === "toDo") {
      newCategory = "toDo";
    } else if (target.id === "inProgress") {
      newCategory = "inProgress";
    } else if (target.id === "awaitFeedback") {
      newCategory = "awaitFeedback";
    } else if (target.id === "done") {
      newCategory = "done";
    }

    if (newCategory) {
      moveTo(newCategory, el);
    }
    dropHandler(el, target);
    updatePlaceholders(); // Aktualisiere Platzhalter nach dem Drop-Event
  });
});

/**
 * Starts the dragging process for a task.
 * @param {string} id - The ID of the task to be dragged.
 * @param {HTMLElement} draggedElement - The element that is being dragged.
 */
function startDragging(id, draggedElement) {
  // Setze den aktuellen Task-Index und das aktuell gezogene Element
  currentTaskElement = getIndexById(tasks, `${id}`);
  currentDraggedElement = draggedElement;
  console.log(
    `CurrentTaskElement: ${currentTaskElement}. CurrentDraggedElement ${currentDraggedElement}`
  );
}

/**
 * Moves a task to a new category.
 * @param {string} category - The new category for the task.
 * @param {HTMLElement} taskElement - The task element that was moved.
 */
function moveTo(category, taskElement) {
  // Finde die aktuelle Aufgabe basierend auf dem Element
  console.log(currentTaskElement);
  tasks[currentTaskElement]["category"] = category;
  // renderTasks();
}

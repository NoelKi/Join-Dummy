window.onload = function () {
  includeHTML();
  clearAllInputs();
  getUserLists();
  loadContactList();
  checkInputs();
};

let priorityValue = "";
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
let generatedContatcs = document.getElementById('hide-box');
let generateList = document.getElementById('generate-list');
let inputField = document.getElementById('subtask-input-field');

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

function clearAllInputs() {
  resetInputFields();
  resetUIElements();
  clearAllStates();
}

function resetInputFields() {
  titleInput.value = "";
  textarea.value = "";
  dateInput.value = "";
  selectValue.value = "Select contacts to assign";
  optionSearch.value = "";
  selectCategoryOption.querySelector("input").value = "Select Category";
}

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

function clearAllStates() {
  subtaskArr = [];
  resetPriorityButtons();
  clearCollaborators();
  clearSelectedContacts();
  renderSubtasks();
  loadContactList();
}

function resetPriorityButtons() {
  document.querySelectorAll(".buttons button").forEach((btn) => {
    btn.classList.remove("selected-btn");
    btn.querySelector(".button-img").classList.remove("selected-btn");
  });
}

function checkInputs() {
  let isTitleValid = titleInput.value.trim() !== "";
  let isDateValid = dateInput.value.trim() !== "";
  createTaskBtn.disabled = !(isTitleValid && isDateValid);
}

function disableButton() {
  createTaskBtn.disabled = true;
}

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
}

function clearCollaborators() {
  collaborators = [];
  selectionState = {};
  renderCollaborators();
}


function handleInputFocusAndEvents() {
  let inputField = document.getElementById('subtask-input-field');
  inputField.focus();
  inputField.addEventListener('blur', function () {
    addSubtaskList();
  });
  inputField.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSubtaskList();
    }
  });
  document.addEventListener('click', handleClickOutside, true);
}

function changeToFocus() {
  let changedInput = document.getElementById('input-subtask-add');
  changedInput.innerHTML = getSubtaskInputHTML();
  handleInputFocusAndEvents();
}

function addSubtaskList() {
  let subtaskInput = document.getElementById('subtask-input-field').value;
  if (subtaskInput.trim() !== "") {
    let uniqueId = Number(Date.now().toString());
    let newSubtask = {
      name: subtaskInput,
      id: uniqueId,
      state: 'open'
    };
    subtaskArr.push(newSubtask);
    document.getElementById('subtask-input-field').value = "";
    renderSubtasks();
  } else {
    clearInputSubtask();
  }
}

function handleClickOutside(event) {
  let inputWrapper = document.getElementById('subtask-input-wrapper');
  if (inputWrapper && !inputWrapper.contains(event.target)) {
    clearInputSubtask();
    document.removeEventListener('click', handleClickOutside, true);
  }
}

function addHoverEventListeners() {
  let taskDivs = document.querySelectorAll(".input-positioning-subtask");
  taskDivs.forEach(function (taskDiv) {
    taskDiv.addEventListener("mouseenter", function () {
      let icons = taskDiv.querySelector(".subtask-add-icons");
      if (icons) {
        icons.classList.remove("d-none");
      }
    });
    taskDiv.addEventListener("mouseleave", function () {
      let icons = taskDiv.querySelector(".subtask-add-icons");
      if (icons) {
        icons.classList.add("d-none");
      }
    });
  });
}

function addSubtaskEventListeners(task) {
  document.getElementById(`subtask-input-field-sub-${task.id}`).addEventListener('dblclick', function () {
    editSubtask(task.id);
  });
}

function renderSubtasks() {
  let addedSubtask = document.getElementById('added-subtask');
  addedSubtask.innerHTML = "";
  for (let i = 0; i < subtaskArr.length; i++) {
    let task = subtaskArr[i];

    addedSubtask.innerHTML += `
      <div class="input-positioning-subtask" id="input-positioning-${String(task.id)}">
        <input class="subtask-css-input" id="subtask-input-field-sub-${String(task.id)}" type="text" value="${task.name}" readonly />
        <div class="center-flexbox">
          <div class="subtask-add-icons d-none" id="d-none-${String(task.id)}">
            <div class="icons-subtask center-flexbox"><img src="../assets/img/bin.svg" onclick="removeSubtask(${String(task.id)})"></div>
            <div class="separator-subtask"></div>
            <div class="icons-subtask center-flexbox"><img src="../assets/img/subtask_save.svg"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById(`subtask-input-field-sub-${String(task.id)}`).addEventListener('dblclick', function () {
      editSubtask(String(task.id));
    });
  }
  addHoverEventListeners();
}

function editSubtask(id) {
  let subTaskDiv = document.getElementById('input-positioning-' + id);
  let inputField = document.getElementById(`subtask-input-field-sub-${id}`);
  let showIcons = document.getElementById('d-none-' + id);

  makeEditable(subTaskDiv, showIcons, inputField);
  setupInputEvents(id, inputField);
}

function makeEditable(subTaskDiv, showIcons, inputField) {
  subTaskDiv.classList.add('editable');
  showIcons.classList.remove('d-none');
  inputField.removeAttribute('readonly');
  inputField.focus();
}

function setupInputEvents(id, inputField) {
  inputField.addEventListener('blur', function () {
    handleBlurEvent(id, inputField);
  });
  inputField.addEventListener('keypress', function (event) {
    handleKeyPressEvent(event, inputField);
  });
}

function handleBlurEvent(id, inputField) {
  try {
    updateSubtask(id, inputField.value);
  } catch (error) {
    alert(error.message);
    inputField.focus();
  }
}

function handleKeyPressEvent(event, inputField) {
  if (event.key === 'Enter') {
    inputField.blur();
  }
}

function updateSubtask(id, newValue) {
  newValue = newValue.trim();
  let bulletPattern = /^•\s*/;
  if (bulletPattern.test(newValue)) {
    newValue = newValue.replace(bulletPattern, '');
  }
  findAndUpdateOrRemoveSubtask(id, newValue);
  renderSubtasks();
}

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

function removeSubtask(id) {
  subtaskArr = subtaskArr.filter(task => task.id !== id);
  renderSubtasks();
}

function clearInputSubtask() {
  document.getElementById('subtask-input-field').value = '';
}

function toggleCategoryList() {
  if (categoryList.style.display === "block") {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  } else {
    categoryList.style.display = "block";
    dropDownArrowCat.style.transform = "rotate(180deg)";
  }
}

function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}

function pushTaskToTasks() {
  tasks.push({
    id: Date.now().toString(),
    date: dateInput.value,
    title: titleInput.value,
    kind: kindValue,
    taskColor: kindColor,
    description: textarea.value,
    category: "toDo",
    priority: priorityValue,
    collaborators: collaborators,
    subtask: subtaskArr,
  });
}

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

function clearTaskKind() {
  kindColor = "";
  kindValue = "";
}

function createTask(event) {
  event.preventDefault();
  pushTaskToTasks();
  updateUser(
    CURRENT_USER_DATA.name,
    CURRENT_USER_DATA.email,
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks
  );
  disableButton();
  setTimeout(() => {
    clearAllInputs();
  }, 0);
  showAnimation();
}

function showAnimation() {
  let animationDiv = document.getElementById('added-animation');
  animationDiv.style.display = 'flex';
  setTimeout(function() {
    animationDiv.classList.add('show');
  }, 10);
  setTimeout(function() {
    animationDiv.classList.remove('show');
    setTimeout(function() {
      animationDiv.style.display = 'none';
      window.location.href = 'board.html';
    }, 500);
  }, 1000);
}




  






  






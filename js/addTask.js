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
let inputField = document.getElementById("subtask-input-field");
let changedInput = document.getElementById("change-to-focus");
let generatedContatcs = document.getElementById('hide-box');



async function getUserLists() {
  try {
    CURRENT_USER_DATA = await getUserData(USER_ID);
    setUserInitals();
    if (!CURRENT_USER_DATA.contacts) {
      contacts = [];
    } else {
      contacts = CURRENT_USER_DATA.contacts;
      loadContactList();
    }
    if (!CURRENT_USER_DATA.tasks) {
      tasks = [];
    } else {
      tasks = CURRENT_USER_DATA.tasks;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}

function clearAllInputs() {
  titleInput.value = "";
  textarea.value = "";
  dateInput.value = "";
  selectValue.value = "Select contacts to assign";
  selectBox.classList.remove("active-task");
  categoryList.style.display = "none";
  dropDownArrowCat.style.transform = "rotate(0deg)";
  optionSearch.value = "";
  optionList.forEach((li) => (li.style.display = ""));
  selectCategoryOption.querySelector("input").value = "Select Category";
  titleError.style.display = "none";
  dateError.style.display = "none";
  titleInput.style.borderBottomColor = "";
  dateInput.style.borderBottomColor = "";
  resetPriorityButtons();
  clearCollaborators();
  clearSelectedContacts();
  subtaskArr = [];
  renderSubtasks();
  loadContactList();
}

function clearSelectedContacts() {
  selectionState = {};
  document.querySelectorAll(".contact-task-assign").forEach(element => {
    element.classList.remove("selected");
    element.querySelector(".check-box-task img").src = "../assets/img/checkBoxTaskHtml.svg";
  });
}

clearTaskBtn.addEventListener("click", function () {
  clearAllInputs();
  checkInputs();
});

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

selectOption.addEventListener("click", function () {
  selectBox.classList.toggle("active-task");
});

optionList.forEach(function (optionListSingle) {
  optionListSingle.addEventListener("click", function () {
    text = this.textContent;
    selectValue.value = text;
    selectBox.classList.remove("active-task");
    checkInputs();
  });
});

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

document.getElementById("task-form").addEventListener("submit", function (event) {
  if (titleInput.value.trim() === "" || dateInput.value.trim() === "") {
    event.preventDefault();
    if (titleInput.value.trim() === "") {
      titleError.style.display = "inline";
    }
    if (dateInput.value.trim() === "") {
      dateError.style.display = "inline";
    }
  }
});

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
  console.log("Current priority value:", priorityValue);
}

function loadContactList(filteredContacts = contacts) {
  let listContainer = document.getElementById("generate-list");
  listContainer.innerHTML = "";
  let htmlContent = "";

  for (let i = 0; i < filteredContacts.length; i++) {
    const contact = filteredContacts[i];
    const initials = getFirstLetterOfName(contact.name) + getFirstLetterOfName(contact.surname);
    const selectedClass = selectionState[contact.id] ? 'selected' : '';
    htmlContent += generateContactHTML(contact, i, selectedClass, initials);
  }
    listContainer.innerHTML = htmlContent;
    assignContactEventListeners(filteredContacts);
}

function assignContactEventListeners(filteredContacts) {
    let contactAssignElements = document.querySelectorAll(".contact-task-assign");
    contactAssignElements.forEach((element) => {
      element.addEventListener("click", function () {
        handleContactAssignClick(element, filteredContacts);
      });
    });
  }

function handleContactAssignClick(element, filteredContacts) {
  const index = element.dataset.index;
  const contact = filteredContacts[index];

  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
    element.querySelector(".check-box-task img").src = "../assets/img/checkBoxTaskHtml.svg";
    delete selectionState[contact.id];

    const collaboratorIndex = collaborators.findIndex(collab => collab.id === contact.id);
    if (collaboratorIndex > -1) {
      collaborators.splice(collaboratorIndex, 1);
    }
  } else {
    element.classList.add("selected");
    element.querySelector(".check-box-task img").src = "../assets/img/checkedTaskHtml.svg";
    selectionState[contact.id] = true;

    collaborators.push({
      id: contact.id,
      name: `${contact.name} ${contact.surname}`,
      color: contact.color
    }); 
  }
  renderCollaborators();
}

document.addEventListener('click', e => {
  if (!selectValue.contains(e.target)) {
    generatedContatcs.classList.remove('active-task');
  }
})

let generateList = document.getElementById('generate-list');
generateList.addEventListener('click', e => {
  e.stopPropagation();
});

function renderCollaborators() {
  let assignContactsCircle = document.getElementById("assign-contacts-circle");
  assignContactsCircle.innerHTML = "";
  collaborators.forEach(collaborator => {
    const initials = getFirstLetterOfName(collaborator.name.split(" ")[0]) + getFirstLetterOfName(collaborator.name.split(" ")[1]);
    assignContactsCircle.innerHTML += `
      <div class="initials-task-circle" style="background-color: ${collaborator.color};">${initials}</div>
    `;
  });
}

function clearCollaborators() {
  collaborators = [];
  selectionState = {};
  renderCollaborators();
}

function filterContacts(searchName) {
  searchName = searchName.toLowerCase();
  return contacts.filter((contact) => {
    return (
      contact.name.toLowerCase() +
      " " +
      contact.surname.toLowerCase()
    ).includes(searchName);
  });
}

document.getElementById('option-search').addEventListener('input', function (event) {
  const searchName = event.target.value;
  const filteredContacts = filterContacts(searchName);
  loadContactList(filteredContacts);
});

function changeToFocus() {
  let changedInput = document.getElementById('input-subtask-add');
  changedInput.innerHTML = `
    <div class="input-positioning" id="subtask-input-wrapper">
      <input class="subtask-css-input" id="subtask-input-field" type="text" placeholder="Add subtask" />
      <div class="center-flexbox">
        <div class="subtask-add-icons">
          <div class="icons-subtask center-flexbox"><img onclick="clearInputSubtask()" src="../assets/img/clear_subtask.svg" alt=""></div>
          <div class="separator-subtask"></div>
          <div class="icons-subtask center-flexbox"><img onclick="addSubtaskList()" src="../assets/img/subtask_save.svg" alt=""></div>
        </div>
      </div>
    </div>
  `;

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

function addSubtaskList() {
  let subtaskInput = document.getElementById('subtask-input-field').value;
  if (subtaskInput.trim() !== "") {
    let uniqueId = new Date().getTime();
    let newSubtask = {
      name: subtaskInput,
      state: 'open',
      id: uniqueId
    };
    subtaskArr.push(newSubtask);
    console.log("New subtask added:", newSubtask);
    console.log("Updated subtaskArr:", subtaskArr);
    document.getElementById('subtask-input-field').value = "";
    renderSubtasks();
  } else {
    clearInputSubtask();
  }
}
function handleClickOutside(event) {
  const inputWrapper = document.getElementById('subtask-input-wrapper');
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

function renderSubtasks() {
  let addedSubtask = document.getElementById('added-subtask');
  addedSubtask.innerHTML = "";

  for (let i = 0; i < subtaskArr.length; i++) {
    let task = subtaskArr[i];
    let taskWithBullet = "&#x2022; " + task.name;

    addedSubtask.innerHTML += `
      <div class="input-positioning-subtask" id="input-positioning-${task.id}">
        <input class="subtask-css-input" id="subtask-input-field-sub-${task.id}" type="text" value="${taskWithBullet}" readonly />
        <div class="center-flexbox">
          <div class="subtask-add-icons d-none" id="d-none-${task.id}">
            <div class="icons-subtask center-flexbox"><img src="../assets/img/bin.svg" onclick="removeSubtask(${task.id})"></div>
            <div class="separator-subtask"></div>
            <div class="icons-subtask center-flexbox"><img src="../assets/img/subtask_save.svg"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById(`subtask-input-field-sub-${task.id}`).addEventListener('dblclick', function () {
      editSubtask(task.id);
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
  renderSubtasks();
}
    

function removeSubtask(id) {
  subtaskArr = subtaskArr.filter(task => task.id !== id);
  renderSubtasks();
}

function clearInputSubtask() {
  document.getElementById('subtask-input-field').value = '';
}


document.querySelectorAll(".contact-item").forEach(function (item) {
  item.addEventListener("click", function () {
    let textDiv = item.querySelector(".contact-text");
    selectValue.value = textDiv.textContent;
    selectBox.classList.remove("active-task");
    checkInputs();
  });
});

function toggleCategoryList() {
  if (categoryList.style.display === "block") {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  } else {
    categoryList.style.display = "block";
    dropDownArrowCat.style.transform = "rotate(180deg)";
  }
}


selectCategoryOption.addEventListener("click", function (event) {
  toggleCategoryList();
  event.stopPropagation();
});

optionSearch.addEventListener("click", function (event) {
  toggleCategoryList();
  event.stopPropagation();
});

document.addEventListener("click", function (event) {
  if (!selectBoxCategory.contains(event.target)) {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  }
});

categoryList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    selectCategoryOption.querySelector("input").value = e.target.textContent;
    categoryList.style.display = "none";
    checkInputs();
  }
});

function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}

function pushTaskToTasks() {  // Don't touch !!!!!
  // auf benennung in board.js achten
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

function createTask(event) {  // Don't touch !!!!!
  // function for create Task button
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
  var animationDiv = document.getElementById('added-animation');
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

  

  





  






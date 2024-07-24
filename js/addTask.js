window.onload = function () {
  getUserLists();
  includeHTML();
  loadContactList();
};

let priorityValue = "";
let kindValue = "";
let kindColor = "";

let categoryArr = [];

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
let option = document.querySelector(".option");
let optionList = document.querySelectorAll(".option li");
let dropDownArrow = document.querySelector(".drop-down-arrow");
let dropDownArrowCat = document.querySelector(".drop-down-arrow-cat");
let selectBoxCategory = document.querySelector(".select-box-category");
let selectCategoryOption = document.getElementById("select-category");
let categoryList = document.getElementById("category-list");



let contacts = [];
let selectedContacts = [];
let collaborators = [];
let subtaskArr = [];


async function getUserLists() {
  console.log('hallo');
  try {
    currUserData = await getUserData(USER_ID);
    if (!currUserData.contacts) {
      contacts = [];
    } else {
      contacts = currUserData.contacts;
      loadContactList();
    }
    if (!currUserData.tasks) {
      tasks = [];
    } else {
      tasks = currUserData.tasks;
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
  
}

function clearSelectedContacts() {
  contacts.forEach(contact => contact.selected = false);
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
    btn.classList.remove("selected");
    btn.querySelector(".button-img").classList.remove("selected");
  });
}

function checkInputs() {
  let isTitleValid = titleInput.value.trim() !== "";
  let isDateValid = dateInput.value.trim() !== "";
  createTaskBtn.disabled = !(isTitleValid && isDateValid);
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
    priorityValue = priority;
    document.querySelectorAll(".buttons button").forEach((btn) => {
      btn.classList.remove("selected-btn");
      btn.querySelector(".button-img").classList.remove("selected-btn");
    });
    const selectedButton = document.getElementById(priority.toLowerCase());
    selectedButton.classList.add("selected-btn");
    selectedButton.querySelector(".button-img").classList.add("selected-btn");
  }


  contacts.forEach(contact => contact.selected = false);

  function loadContactList(filteredContacts = contacts) {
    let listContainer = document.getElementById("generate-list");
    listContainer.innerHTML = ""; // Clear existing content
    let htmlContent = "";
  
    for (let i = 0; i < filteredContacts.length; i++) {
      const initials =
        getFirstLetterOfName(filteredContacts[i].name) +
        getFirstLetterOfName(filteredContacts[i].surname);
        const selectedClass = filteredContacts[i].selected ? 'selected' : '';
        
      htmlContent += `
        <div class="contact-task-assign ${selectedClass}" data-index="${i}">
          <div class="icon-name-contact center-flexbox">
            <div class="initials-task" style="background-color: ${filteredContacts[i].color};">${initials}</div>
            <div class="contact-text-task">${filteredContacts[i].name} ${filteredContacts[i].surname}</div>
          </div>
            <div class="check-box-task"><img src="../assets/img/${filteredContacts[i].selected ? 'checkedTaskHtml.svg' : 'checkBoxTaskHtml.svg'}"></div>
        </div>
      `;
    }
  
    listContainer.innerHTML = htmlContent; // Set the entire HTML content at once
  
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
    contact.selected = false; 
    const collaboratorIndex = collaborators.findIndex(collaborator => collaborator.name === `${contact.name} ${contact.surname}`);
    if (collaboratorIndex > -1) {
      collaborators.splice(collaboratorIndex, 1);
    }
  } else {
    element.classList.add("selected");
    element.querySelector(".check-box-task img").src =
"../assets/img/checkedTaskHtml.svg";
    contact.selected = true;
    collaborators.push({
      name: `${contact.name} ${contact.surname}`,
      color: contact.color
    });
  }
  renderCollaborators();
  console.log(collaborators); 
}
    
function renderCollaborators() {
  let assignContactsCircle = document.getElementById("assign-contacts-circle");
  assignContactsCircle.innerHTML = "";
  collaborators.forEach(collaborator => {
    const initials =
      getFirstLetterOfName(collaborator.name.split(" ")[0]) +
      getFirstLetterOfName(collaborator.name.split(" ")[1]);
    assignContactsCircle.innerHTML += `
      <div class="initials-task-circle" style="background-color: ${collaborator.color};">${initials}</div>
    `;
  });
}

function clearCollaborators() {
  collaborators = [];
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


document.getElementById('option-search').addEventListener('input', function(event) {
  const searchName = event.target.value;
  const filteredContacts = filterContacts(searchName);
  loadContactList(filteredContacts);
});
  
    







  
  getUserLists();
  loadContactList();
  
  // Adding event listeners dynamically to each 'div' element
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
  
  checkInputs();
  
  function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name.toUpperCase();
  }
  
  function pushTaskToTasks() {  // Don't touch !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // auf benennung in board.js achten
    tasks.push({
      id: Date.now().toString(),
      date: dateInput.value,
      title: titleInput.value,
      kind: kindValue,
      taskColor: kindColor, //Technical Task #0038FF;  User Story #FF7A00
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
  
  function createTask(event) {  // Don't touch !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // function for create Task button
    event.preventDefault();
    pushTaskToTasks(); 
    updateUser(
      currUserData.name,
      currUserData.email,
      currUserData.password,
      currUserData.contacts,
      tasks
    );
    // deleteValues();
  }
  
  function addSubtask() {
    const name = document.getElementById("subtask-input-field");
    subtaskArr.push({
      name: name.value,
      id: Date.now().toString(),
      state: "open",
    });
    name.value = "";
  }












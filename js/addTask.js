

    let testNames = [
    {
      "firstName": "John",
      "lastName": "Doe"
    },
    {
      "firstName": "Jane",
      "lastName": "Smith"
    },
    {
      "firstName": "Michael",
      "lastName": "Johnson"
    },
    {
      "firstName": "Emily",
      "lastName": "Williams"
    },
    {
      "firstName": "David",
      "lastName": "Brown"
    },
    {
      "firstName": "Sarah",
      "lastName": "Jones"
    },
    {
      "firstName": "Daniel",
      "lastName": "Miller"
    },
    {
      "firstName": "Jessica",
      "lastName": "Davis"
    },
    {
      "firstName": "Matthew",
      "lastName": "Garcia"
    },
    {
      "firstName": "Laura",
      "lastName": "Martinez"
    }
  ];




  let titleInput = document.getElementById("add-title");
  let titleError = document.getElementById("title-error");
  let textarea = document.getElementById('textarea-task');
  let dateInput = document.getElementById("due-date");
  let dateError = document.getElementById("date-error");
  let addTaskBtn = document.getElementById("add-task-btn");
  let selectBox = document.querySelector('.select-box');
  let selectOption = document.querySelector('.select-option');
  let selectValue = document.getElementById('select-value');
  let optionSearch = document.getElementById('option-search');
  let option = document.querySelector('.option');
  let optionList = document.querySelectorAll('.option li');
  let dropDownArrow = document.querySelector('.drop-down-arrow');
  let dropDownArrowCat = document.querySelector('.drop-down-arrow-cat');
  let selectBoxCategory = document.querySelector(".select-box-category");
  let selectCategoryOption = document.getElementById("select-category");
  let categoryList = document.getElementById("category-list");

  


selectOption.addEventListener('click', function(){
  selectBox.classList.toggle('active');
});
    
 

optionList.forEach(function(optionListSingle){
  optionListSingle.addEventListener('click',function(){
    text = this.textContent;
    selectValue.value = text;
    selectBox.classList.remove('active');
  })
});

optionSearch.addEventListener('keyup',function(){
  var filter, li, i, textValue;
  filter = optionSearch.value.toUpperCase();
  li = option.getElementsByTagName('li');
  for(i = 0; i < li.length; i++){
    liCount = li[i];
    textValue = liCount.textContent || liCount.innerText;
    if(textValue.toUpperCase().indexOf(filter) > -1){
      li[i].style.display = '';
    } else{
      li[i].style.display = 'none';
    }
  }
})


titleInput.addEventListener("focusout", function () {
  if (titleInput.value.trim() === "") {
    titleError.style.display = "inline";
  } else {
    titleError.style.display = "none";
  }
});

titleInput.addEventListener("focusout", function () {
  if (titleInput.value.trim() === "") {
    titleError.style.display = "inline";
    titleInput.style.borderBottomColor = "#ff8190";
  } else {
    titleInput.style.borderBottomColor = "";
  }
});

dateInput.addEventListener('focusout', function() {
  if (dateInput.value.trim() === '') {
      dateError.style.display = 'inline';
      dateInput.style.borderBottomColor = '#ff8190';
      dateInput.style.color = 'black';
  } else {
      dateError.style.display = 'none';
      dateInput.style.borderBottomColor = '';
      dateInput.style.color = 'black';
  }
});

document.getElementById("task-form").addEventListener("submit", function (event) {
    if (titleInput.value.trim() === "") {
      event.preventDefault();
      titleError.style.display = "inline";
    } else {
      titleError.style.display = "none";
    }
    if (dateInput.value.trim() === "") {
      dateError.style.display = "inline";
    } else {
      dateError.style.display = "none";
    }
  });

  function selectPriority(priority) {
    
    document.querySelectorAll(".buttons button").forEach((btn) => {
      btn.classList.remove("selected");
      btn.querySelector(".button-img").classList.remove("selected");
    });
    const selectedButton = document.getElementById(priority.toLowerCase());
    selectedButton.classList.add("selected");
    selectedButton.querySelector(".button-img").classList.add("selected");
  }
  
  function loadContactList() {
    let listContainer = document.getElementById('generate-list');
    listContainer.innerHTML = '';
    for (let i = 0; i < testNames.length; i++) {
        let li = document.createElement('li');
        li.textContent = `${testNames[i].firstName} ${testNames[i].lastName}`;
        li.addEventListener('click', function() {
            selectValue.value = li.textContent;
            selectBox.classList.remove('active');
        });
        listContainer.appendChild(li);
    }
}

loadContactList();


function toggleCategoryList() {
  if (categoryList.style.display === 'block') {
    categoryList.style.display = 'none';
    dropDownArrowCat.style.transform = 'rotate(0deg)'; 
  } else {
    categoryList.style.display = 'block';
    dropDownArrowCat.style.transform = 'rotate(180deg)'; 
  }
}

selectCategoryOption.addEventListener('click', function(event) {
  toggleCategoryList();
  event.stopPropagation(); 
});

document.addEventListener('click', function(event) {
  if (!selectBoxCategory.contains(event.target)) {
    categoryList.style.display = 'none';
    dropDownArrowCat.style.transform = 'rotate(0deg)'; 
  }
});

categoryList.addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    selectCategoryOption.querySelector('input').value = e.target.textContent;
    categoryList.style.display = 'none';
    dropDownArrowCat.style.transform = 'rotate(0deg)'; 
  }
});


// subtask

function addSubtask() {
  let subTaskInput = document.getElementById("subtask-input-field");
  let subTaskValue = subTaskInput.value.trim();

  if (subTaskValue !== "") {
    let addedSubtaskDiv = document.getElementById("added-subtask");
    let subTaskElement = document.createElement("div");
    subTaskElement.innerHTML = `<span>${subTaskValue}</span>
                                      <button class="edit-btn">Edit</button>
                                      <button class="delete-btn">Delete</button>`;
    addedSubtaskDiv.appendChild(subTaskElement);
    subTaskInput.value = "";
    subTaskElement
      .querySelector(".edit-btn")
      .addEventListener("click", () => editSubtask(subTaskElement));
    subTaskElement
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteSubtask(subTaskElement));
  }
}

function editSubtask(subTaskElement) {
  let subTaskText = subTaskElement.querySelector("span");
  let newText = prompt("Edit Subtask", subTaskText.textContent);

  if (newText !== null && newText.trim() !== "") {
    subTaskText.textContent = newText;
  }
}

function deleteSubtask(subTaskElement) {
  if (confirm("Are you sure you want to delete this subtask?")) {
    subTaskElement.remove();
  }
}

function updateAddTaskButtonState() {
  let titleInput = document.getElementById("add-title");
  let dateInput = document.getElementById("due-date");
  let addTaskBtn = document.getElementById("add-task-btn");

  if (titleInput.value.trim() === "" || dateInput.value.trim() === "") {
    addTaskBtn.disabled = true;
  } else {
    addTaskBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let titleInput = document.getElementById("add-title");
  let dateInput = document.getElementById("due-date");
  let addTaskBtn = document.getElementById("add-task-btn");

  updateAddTaskButtonState();

  titleInput.addEventListener("input", updateAddTaskButtonState);
  dateInput.addEventListener("input", updateAddTaskButtonState);
});




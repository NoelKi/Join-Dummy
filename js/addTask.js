

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
  selectBox.classList.toggle('active-task');
});
    
 

optionList.forEach(function(optionListSingle){
  optionListSingle.addEventListener('click',function(){
    text = this.textContent;
    selectValue.value = text;
    selectBox.classList.remove('active-task');
  })
});

optionSearch.addEventListener('keyup', function() {
  let filter = optionSearch.value.toUpperCase();
  let li = option.getElementsByTagName('li');
  for (let i = 0; i < li.length; i++) {
    let textValue = li[i].textContent || li[i].innerText;
    li[i].style.display = textValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
  }
});


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
            selectBox.classList.remove('active-task');
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
    dropDownArrowCat.style.transform = 'rotate(0deg)'; // Reset rotation
  }
});


categoryList.addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    selectCategoryOption.querySelector('input').value = e.target.textContent;
    categoryList.style.display = 'none';
    
  }
});

















// subtask




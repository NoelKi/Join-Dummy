

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
  let createTaskBtn = document.getElementById("add-task-btn");
  let clearTaskBtn = document.getElementById("clear-task-btn");
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

  function clearAllInputs() {
    titleInput.value = "";
    textarea.value = "";
    dateInput.value = "";
    selectValue.value = "Select contacts to assign";
    selectBox.classList.remove('active-task');
    categoryList.style.display = 'none';
    dropDownArrowCat.style.transform = 'rotate(0deg)';
    optionSearch.value = "";
    optionList.forEach(li => li.style.display = '');
    selectCategoryOption.querySelector('input').value = 'Select Category';
    titleError.style.display = "none";
    dateError.style.display = "none";
    titleInput.style.borderBottomColor = "";
    dateInput.style.borderBottomColor = "";
    resetPriorityButtons();
  }
    
  clearTaskBtn.addEventListener('click', function() {
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
  
  selectOption.addEventListener('click', function(){
    selectBox.classList.toggle('active-task');
  });
      
  optionList.forEach(function(optionListSingle){
    optionListSingle.addEventListener('click',function(){
      text = this.textContent;
      selectValue.value = text;
      selectBox.classList.remove('active-task');
      checkInputs();
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
      titleInput.style.borderBottomColor = "#ff8190";
      
    } else {
      titleError.style.display = "none";
      titleInput.style.borderBottomColor = "";
      
    }
    checkInputs();
    
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
    checkInputs();
    
  });
  
  document.getElementById("task-form").addEventListener("submit", function(event) {
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
    let htmlContent = ''; 
  
    for (let i = 0; i < testNames.length; i++) {
      htmlContent += `
        
          <div class="contact-task-assign">
            <div class="icon-name-contact">
              <div class="initials">AB</div>
              <div class="contact-text-task">${testNames[i].firstName} ${testNames[i].lastName}</div>
            </div>
            <div id="check-box-task"><img src="../assets/img/checkBoxTaskHtml.svg"></div>
          </div>
          
      `;
    }
  
    listContainer.innerHTML = htmlContent; // Set the entire HTML content at once
  
    // Adding event listeners dynamically to each 'div' element
    document.querySelectorAll('.contact-item').forEach(function(item) {
      item.addEventListener('click', function() {
        let textDiv = item.querySelector('.contact-text');
        selectValue.value = textDiv.textContent;
        selectBox.classList.remove('active-task');
        checkInputs();
      });
    });
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
    checkInputs();
    
  }
});

checkInputs();








  
 
 
 
 



















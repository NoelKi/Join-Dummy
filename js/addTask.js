let titleInput = document.getElementById("add-title");
let titleError = document.getElementById("title-error");
let dateInput = document.getElementById("due-date");
let dateError = document.getElementById("date-error");

titleInput.addEventListener("focusout", function () {
  if (titleInput.value.trim() === "") {
    titleError.style.display = "inline";
  } else {
    titleError.style.display = "none";
  }
});

dateInput.addEventListener("focusout", function () {
  if (dateInput.value.trim() === "") {
    dateError.style.display = "inline";
  } else {
    dateError.style.display = "none";
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
      subTaskElement.querySelector(".edit-btn").addEventListener("click", () => editSubtask(subTaskElement));
      subTaskElement.querySelector(".delete-btn").addEventListener("click", () => deleteSubtask(subTaskElement));
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
  

      
      


  

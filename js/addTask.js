let titleInput = document.getElementById("add-title");
let titleError = document.getElementById("title-error");
let dateInput = document.getElementById("due-date");
let dateError = document.getElementById("date-error");
let addTaskBtn = document.getElementById("add-task-btn");

const BASE_URLTASK = "https://test2-654cc-default-rtdb.europe-west1.firebasedatabase.app/";

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

  function selectPriority(priority) {
    document.querySelectorAll('.priority button').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(priority.toLowerCase()).classList.add('selected');
  }
      
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

document.addEventListener('DOMContentLoaded', function() {
    let titleInput = document.getElementById("add-title");
    let dateInput = document.getElementById("due-date");
    let addTaskBtn = document.getElementById("add-task-btn");

    updateAddTaskButtonState();

    titleInput.addEventListener('input', updateAddTaskButtonState);
    dateInput.addEventListener('input', updateAddTaskButtonState);
});
  
// Funktion zum Sammeln von Formulardaten und Senden an Firebase
document.getElementById('task-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    let title = document.getElementById('add-title').value.trim();
    let description = document.getElementById('textarea-task').value.trim();
    let dueDate = document.getElementById('due-date').value.trim();
    let priority = document.querySelector('.priority .selected')?.textContent.trim() || '';
    let assignedTo = document.getElementById('assigned-to-select').value.trim();
    let category = document.getElementById('category-task').value.trim();

    // Sammeln der Subtasks
    let subtaskElements = document.querySelectorAll('#added-subtask div span');
    let subtasks = [];
    subtaskElements.forEach(subtaskElement => {
        subtasks.push(subtaskElement.textContent.trim());
    });

    // Erstellen des Datenobjekts
    let taskData = {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        assignedTo: assignedTo,
        category: category,
        subtasks: subtasks
    };

    // Konvertieren des Datenobjekts in einen JSON-String
    let taskDataString = JSON.stringify(taskData);

    // Senden der Daten an Firebase
    try {
        let response = await fetch(`${BASE_URLTASK}/tasks.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: taskDataString
        });

        if (response.ok) {
            alert('Task added successfully!');
        } else {
            alert('Failed to add task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding task');
    }
});
      


  

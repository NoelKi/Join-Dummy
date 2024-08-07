/**
 * Creates an HTML string for an empty box with a custom sign.
 * @param {string} sign - The sign to display inside the empty box.
 * @returns {string} The HTML string of the empty box.
 */
function createEmptyBox(sign) {
  return `<div class="empty-box">No tasks ${sign}</div>`;
}

/**
 * Creates an HTML string for collaborator initials.
 * @param {string} initials - The initials of the collaborator.
 * @returns {string} The HTML string of the collaborator initials.
 */
function createCollabInitialsHtml(initials) {
  return `<div class="initials">${initials}</div>`;
}

/**
 * Creates an HTML string for the task overlay.
 * @param {Object} element - The task object containing task details.
 * @param {number} id - The ID of the task.
 * @returns {string} The HTML string of the task overlay.
 */
function createTaskOverlay(element, id) {
  let a = `<div class="show-task-overlay" onclick="closeTaskOverlay()">
            <div class="show-task-container" onclick="event.stopPropagation()">
                <div class="top-task-container">
                    <div class="task-kind-container no-margin font-size-19" style="background-color: ${element.taskColor}">
                        ${element.kind}
                    </div>
                    <button class="close-btn-overlay no-margin" onclick="closeTaskOverlay()">
                        <img src="../assets/img/closeTask.svg">
                    </button>
                </div>
                <div class="task-title-container">
                    ${element.title}
                </div>
                <div class="m-b-20">
                    ${element.description}
                </div>
                <div class="m-b-20">
                    <b>Due date:</b> &ensp; ${element.date}
                </div>
                <div class="task-overlay-priority">
                    <b>Priority:</b>&ensp;&ensp;&ensp; ${element.priority} <img src="../assets/img/priority${element.priority}.svg">
                </div>`;
  if (element.collaborators) {
    a += createTaskOverlayCollaborators(element.collaborators);
  }
  if (element.subtask) {
    a += createTaskOverlaySubtasks(element.subtask, element.id);
  }
  a += `  <div class="task-edit-container">
                    <div class="delete-task-overlay-btn" onclick="deleteTask(${element.id})">
                        <img class="delete-unhover" src="../assets/img/deleteUnhover.svg">
                        <img class="delete-hover" src="../assets/img/deleteHover.svg">
                    </div>
                    <div class="horizontal-separator"></div>
                    <div class="edit-task-overlay-btn" onclick="renderEditTaskOverlay(${id})">
                        <img class="edit-unhover" src="../assets/img/editUnhover.svg">
                        <img class="edit-hover" src="../assets/img/editHover.svg">
                    </div>
                </div>
            </div>
        </div>`;
  return a;
}

/**
 * Creates an HTML string for the collaborators section in the task overlay.
 * @param {Array} collaborators - Array of collaborator objects.
 * @returns {string} The HTML string of the collaborators section.
 */
function createTaskOverlayCollaborators(collaborators) {
  let content = `<div> <b>Assigned to:</b> <br>`;
  for (const collab of collaborators) {
    [name, surname] = collab.name;
    initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
    content += `<div class="flex-row m-l-12 m-t-12"> 
                <div class="initials m-r-10" style="background-color: ${collab.color}">${initials}</div> ${collab.name}
                </div>`;
  }
  content += `</div>`;
  return content;
}

/**
 * Creates an HTML string for the subtasks section in the task overlay.
 * @param {Array} subtasks - Array of subtask objects.
 * @param {number} objectId - The ID of the parent task.
 * @returns {string} The HTML string of the subtasks section.
 */
function createTaskOverlaySubtasks(subtasks, objectId) {
  let content = `<div class="task-subtask-container m-t-12" id="subtasks-overlay">
                            <b>Subtasks</b>
                                <div class="subtask-inner-container m-t-20">`;
  for (const subtask of subtasks) {
    content += `<div class="subtask-inner-inner-container" onclick="switchSubtaskState(${objectId},${subtask.id})">
                <img src="../assets/img/${subtask.state}CheckButton.svg"> 
                    &ensp;${subtask.name}
                </div>`;
  }
  content += `</div>`;
  return content;
}

/**
 * Renders the HTML for a task.
 * @param {Object} element - The task object containing task details.
 * @returns {string} The HTML string of the task.
 */
function renderTaskHtml(element) {
  let a = `<li id="${element.id}" class="task-container" draggable="true" ondragstart="startDragging(${element["id"]},event)" ondragover="dragOver(event)" onclick="renderTaskOverlay(${element["id"]});">
              <div class="task-kind-container" style="background-color: ${element.taskColor}">${element.kind}</div>
              <div class="task-content-container">
                  <div class="task-title">${element.title}</div>
                  <div class="task-description">${element.description}</div>`;
  if (element.subtask) {
    a += createSubtaskBarHtml(element.subtask);
  }
  a += `<div class="task-bottom-container">
                  <div class="task-collaborators" id="task-collaborators-${element.id}">`;
  if (element.collaborators) {
    for (const collab of element.collaborators) {
      [name, surname] = collab.name;
      initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
      a += `<div class="initials" style="background-color: ${collab.color}">${initials}</div>`;
    }
  }
  a += `</div>
                      <div class="task-priority" id="task-priority">
                          <img src="../assets/img/priority${element.priority}.svg">
                      </div>
                  </div>
              </div>
          </li>`;
  return a;
}

/**
 * Creates an HTML string for the subtask progress bar.
 * @param {Array} subtasks - Array of subtask objects.
 * @returns {string} The HTML string of the subtask progress bar.
 */
function createSubtaskBarHtml(subtasks) {
  let count = 0;
  for (const subtask of subtasks) {
    if (subtask.state === "done") {
      count += 1;
    }
  }
  const width = (count / subtasks.length) * 100;
  return `<div class="task-subtask" id="task-subtask">
    <div class="task-progress-bar">
        <div class="task-bar" style="width: ${width}%"></div>    
    </div>
    <div id="subtask">${count}/${subtasks.length} Subtasks</div>
    </div>`;
}

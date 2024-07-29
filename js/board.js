let currentTaskElement;
let tasks = [];
let currentDraggedElement;

let tasksExample = [{
    'id': 0,
    'date': '10/21/2024',
    'title': 'Putzen',
    'kind': 'Technical Task',
    'taskColor': '#0038FF',
    'description': 'BlaBliBulb',
    'category': 'inProgress',
    'priority': 'Medium',
    'collaborators': [{
        'name': 'Anche Apfelgrün',
        'color': '#C3FF2B'
    },
    {
        'name': 'Rosi Rot',
        'color': '#FF4646'
    }],
    'subtask': [{
        'name': 'Küche putzen',
        'state': 'done',
        'id': 2023
    },
    {
        'name': 'Flur putzen',
        'state': 'done',
        'id': 206
    },]
}];

window.onload = function () {
    includeHTML();
    getUserLists();
}

async function getUserLists() {
    try {
        CURRENT_USER_DATA = await getUserData(USER_ID);
        setUserInitals();
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
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    }
}

function renderTasks() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}

function renderToDo() {
    let toDo = tasks.filter(t => t['category'] == 'toDo');
    document.getElementById('toDo').innerHTML = '';
    for (let index = 0; index < toDo.length; index++) {
        const element = toDo[index];
        document.getElementById('toDo').innerHTML += renderTaskHtml(element);
    }
    if (toDo.length === 0) {
        document.getElementById('toDo').innerHTML = renderEmptyBox('to do');
    }
}

function renderAwaitFeedback() {
    let awaitFeedback = tasks.filter(t => t['category'] == 'awaitFeedback');

    document.getElementById('awaitFeedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('awaitFeedback').innerHTML += renderTaskHtml(element);

    }
    if (awaitFeedback.length === 0) {
        document.getElementById('awaitFeedback').innerHTML = renderEmptyBox('await feedback');
    }
}

function renderDone() {
    let done = tasks.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += renderTaskHtml(element);
    }
    if (done.length === 0) {
        document.getElementById('done').innerHTML = renderEmptyBox('done');
    }
}

function renderInProgress() {
    let inProgress = tasks.filter(t => t['category'] == 'inProgress');

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('inProgress').innerHTML += renderTaskHtml(element);
    }
    if (inProgress.length === 0) {
        document.getElementById('inProgress').innerHTML = renderEmptyBox('in progress');
    }
}

function startDragging(id, event) {
    currentTaskElement = getIndexById(tasks, `${id}`);
    currentDraggedElement = event.target;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    tasks[currentTaskElement]['category'] = category;
    renderTasks();
}

function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
        for (let cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
            if (cur === el2)
                return true;
    return false;
}

function dragOver(e) {
    if (isBefore(currentDraggedElement, e.currentTarget)) {
        e.currentTarget.parentNode.insertBefore(currentDraggedElement, e.currentTarget);
        console.log(e.currentTarget.parentNode);
    }
    else
        e.currentTarget.parentNode.insertBefore(currentDraggedElement, e.currentTarget.nextSibling);
}

function drop(event) {
    const category = event.currentTarget.id;
    if (category !== tasks[currentTaskElement]['category']) {
        tasks[currentTaskElement]['category'] = category;
        removeHighlight(event);
        renderTasks();
        currentDraggedElement = null;
    } else {
        const array = event.currentTarget.children;
        const idList = [];
        const newTasks = [];
        for (let i = 0; i < array.length; i++) {
            const elId = array[i].id;
            const currIndex = getIndexById(tasks, elId);
            // console.log(tasks[currIndex].title,i,'Element');
            const taskObj = tasks[currIndex];
            newTasks.push(taskObj);
        }
        tasks = newTasks;
        removeHighlight(event);
        renderTasks();
        currentDraggedElement = null;
    }
    updateUser(
        CURRENT_USER_DATA.name,
        CURRENT_USER_DATA.email,
        CURRENT_USER_DATA.password,
        CURRENT_USER_DATA.contacts,
        tasks
    );
}

function highlight(event) {
    event.currentTarget.classList.add('drag-area-highlight');
}

function removeHighlight(event) {
    event.currentTarget.classList.remove('drag-area-highlight');
}

function renderTaskHtml(element) {
    let a = `<li id="${element.id}" class="task-container" draggable="true" ondragstart="startDragging(${element['id']},event)" ondragover="dragOver(event)" onclick="renderTaskOverlay(${element['id']});">
        <div class="task-kind-container" style="background-color: ${element.taskColor}">${element.kind}</div>
        <div class="task-content-container">
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>`;
    if (element.subtask) {
        let count = 0;
        for (const subtask of element.subtask) {
            if (subtask.state === 'done') {
                count += 1;
            }
        }
        const width = count / element.subtask.length * 100;
        a += `<div class="task-subtask" id="task-subtask">
        <div class="task-progress-bar">
            <div class="task-bar" style="width: ${width}%"></div>    
        </div>
        <div id="subtask">${count}/${element.subtask.length} Subtasks</div>
        </div>`;
    }
    a += `<div class="task-bottom-container">
            <div class="task-collaborators" id="task-collaborators-${element.id}">`;
    if (element.collaborators) {
        for (const collab of element.collaborators) {
            [name, surname] = collab.name;
            initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
            a += `<div class="initials" style="background-color: ${collab.color}">${initials}</div>`
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

function renderEmptyBox(sign) {
    return `<div class="empty-box">No tasks ${sign}</div>`;
}

function renderCollabInitials(id) {
    const content = document.getElementById(`task-collaborators-${id}`);

}

function createCollabInitialsHtml(initials) {
    return `<div class="initials">${initials}</div>`;
}

function getFirstLetterOfName(name) {
    name = name.slice(0, 1);
    return name.toUpperCase()
}

function closeOverlay() {
    const content = document.getElementById('board-overlay-section');
    content.style.display = 'none';
}

function renderAddTaskOverlay() {
    const content = document.getElementById('board-overlay-section');
    content.style.display = 'block';
    content.innerHTML = createAddTaskOverlay();
}

function createAddTaskOverlay() {
    return `    
    <div class="board-overlay-section">
        <div class="board-overlay-container" id="board-overlay-container">
            <div class="board-overlay-top-container">
                Add Task
                <button class="close-btn-overlay" onclick="closeOverlay()">
                    <img src="../assets/img/closeTask.svg">
                </button>
            </div>
            <div class="board-overlay-main-container">
            
            <div class="task-container">
      <form id="task-form" class="task-css" onsubmit="createTask(event);">

        <div class="task-section-div">
          <input id="add-title" type="text" class="input-title-task" placeholder="Enter a title*" /><br />
          <span id="title-error" class="error">This field is required*</span>
        </div>

        <div class="task-section-div">
          <div class="margin-bottom-5"><label>Description <span class="optional-text">(optional)</span></label><br />
          </div>
          <textarea placeholder="Enter a Description" class="task-text" id="textarea-task"></textarea>
        </div>

        <div class="task-section-div">
          <label for="due-date">Due Date*</label><br>
          <input class="date-css" id="due-date" type="date" placeholder="dd/mm/yyyy"><br>
          <span id="date-error" class="error">This field is required*</span>
        </div>

        <div class="task-section-div">
          <div class="buttons margin-bottom-8"><label for="Priotity">Priority</label><br></div>
          <div class="buttons" id="unselected-error">
            <button class="button-urgent" id="urgent" type="button" onclick="selectPriority('Urgent')">Urgent <img
                class="button-img" src="../assets/img/urgentIcon.svg"> </button>
            <button class="button-medium" id="medium" type="button" onclick="selectPriority('Medium')">Medium <img
                class="button-img" src="../assets/img/medium.svg"></button>
            <button class="button-low" id="low" type="button" onclick="selectPriority('Low')">Low <img
                class="button-img" src="../assets/img/low.svg"></button>
          </div>
          <span id="priority-error" class="error">This field is required*</span>
        </div>


        <div class="task-section-div">
          <label for="assigned-to">Assigned to <span class="optional-text">(optional)</span></label><br />
          <div class="select-box" id="hide-box">
            <div class="select-option">
              <div class="input-positioning">
                <input type="input-positioning" value="Select contacts to assign" id="select-value" readonly>
                <div class="drop-down-arrow center-flexbox"><img src="../assets/img/arrow_drop_down.svg" alt=""></div>
              </div>
            </div>

            <div class="select-content">
              <div class="search-assign">
                <input type="text" id="option-search" placeholder="  An">
              </div>
              <ul id="generate-list" class="option"></ul>
            </div>
            <div class="circle-positioning" id="assign-contacts-circle"></div>
          </div>
        </div>

        <div class="task-section-div">
          <label for="category-task">Category</label><br />
          <div class="select-box-category">
            <div class="select-option" id="select-category">
              <div class="input-positioning">
                <input type="text" value="Select category" id="category-value" readonly>
                <div class="drop-down-arrow-cat center-flexbox"><img src="../assets/img/arrow_drop_down.svg" alt="">
                </div>
              </div>
            </div>
            <div class="category-list-div">
              <ul id="category-list" class="option-category">
                <li onclick="setTaskKind('TT')">Technical task</li>
                <li onclick="setTaskKind('US')">User story</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="task-section-div">
          <label for="subtask-optional">Subtasks <span class="optional-text">(optional)</span></label><br />
          <div id="subtask-list" class="subtask-list"></div>
          <div id="input-subtask-add" class="select-option" onclick="changeToFocus()">
            <div class="input-positioning">
              <input class="subtask-css-input" id="subtask-input-field" type="text" placeholder="Add subtask" />
              <div class="add-symbol-css center-flexbox">
                <img src="../assets/img/add.svg" alt=""><br>
                
              </div>
            </div>
          </div>

           <div id="added-subtask" class="added-subtask-input"> </div>


        </div>
        
        
        
        
        <div class="clear-create-buttons">
          <button class="clear-task-btn center-flexbox" id="clear-task-btn" type="button">Clear <svg
              class="margin-left-12 icon-clear" width="14" height="13" viewBox="0 0 14 13" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.00081 6.50008L12.2438 11.7431M1.75781 11.7431L7.00081 6.50008L1.75781 11.7431ZM12.2438 1.25708L6.99981 6.50008L12.2438 1.25708ZM6.99981 6.50008L1.75781 1.25708L6.99981 6.50008Z"
                stroke="#647188" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg></button>

          <button class="create-task-btn center-flexbox" id="add-task-btn" type="submit">Create
            Task <svg class="margin-left-12 icon-create" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_19053_7126" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_19053_7126)">
                <path
                  d="M9.55021 15.15L18.0252 6.675C18.2252 6.475 18.4627 6.375 18.7377 6.375C19.0127 6.375 19.2502 6.475 19.4502 6.675C19.6502 6.875 19.7502 7.1125 19.7502 7.3875C19.7502 7.6625 19.6502 7.9 19.4502 8.1L10.2502 17.3C10.0502 17.5 9.81687 17.6 9.55021 17.6C9.28354 17.6 9.05021 17.5 8.85021 17.3L4.55021 13C4.35021 12.8 4.25437 12.5625 4.26271 12.2875C4.27104 12.0125 4.37521 11.775 4.57521 11.575C4.77521 11.375 5.01271 11.275 5.28771 11.275C5.56271 11.275 5.80021 11.375 6.00021 11.575L9.55021 15.15Z"
                  fill="white" />
              </g>
            </svg>

          </button>
        </div>
        
        
          <div id="added-animation">
            <p>Task Added to Board</p>
            <img class="white-color-board" src="../assets/img/board_icon.svg">
          </div>
       
      </form>
    </div>
            
            
            </div>
        </div>
    </div>`;
}

function renderTaskOverlay(id) {
    const element = getObjectById(tasks, `${id}`);
    const content = document.getElementById('board-overlay-section');
    content.style.display = 'block';
    content.innerHTML = createTaskOverlay(element);
}

function createTaskOverlay(element) {
    let a = `<div class="show-task-overlay">
        <div class="show-task-container">
            <div class="top-task-container">
                <div class="task-kind-container no-margin font-size-19" style="background-color: ${element.taskColor}">
                    ${element.kind}
                </div>
                <button class="close-btn-overlay no-margin" onclick="closeOverlay()">
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
                <div class="edit-task-overlay-btn">
                    <img class="edit-unhover" src="../assets/img/editUnhover.svg">
                    <img class="edit-hover" src="../assets/img/editHover.svg">
                </div>
            </div>
        </div>
    </div>`;
    return a;
}

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

function createTaskOverlaySubtasks(subtasks,objectId) {
    let content = `<div class="task-subtask-container m-t-12" id="subtasks-overlay">
                        <b>Subtasks</b>
                            <div class="subtask-inner-container m-t-20">`;
    for (const subtask of subtasks) {
        content += `<div class="subtask-inner-inner-container" onclick="switchSubtaskState(${objectId},${subtask.id})">
            <img src="../assets/img/${subtask.state}CheckButton.svg"> 
                &ensp;${subtask.name}
            </div>`
    }
    content += `</div>`;
    return content;
}

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function switchSubtaskState(taskId, subtaskId) {
    const object = getObjectById(tasks, `${taskId}`);
    const subtask = getObjectById(object.subtask, subtaskId)
    if (subtask.state === 'done') {
        subtask.state = 'open';
    } else { subtask.state = 'done' }
    renderTaskOverlay(taskId);
    renderTasks(object);
}

function getIndexById(arr, id) {
    if (!arr || arr.length === 0) {
        return -1;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return i;
        }
    }
    return -1;
}

function deleteTask(id) {
    const taskIndex = getIndexById(`${id}`);
    tasks.splice(taskIndex, 1);
    updateUser(
        CURRENT_USER_DATA.name,
        CURRENT_USER_DATA.email,
        CURRENT_USER_DATA.password,
        CURRENT_USER_DATA.contacts,
        tasks
    );
    renderTasks();
    closeOverlay();
}
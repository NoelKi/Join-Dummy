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

// element.querySelector('li')
function dragOver(e) {
    console.log(isBefore(currentDraggedElement, e.currentTarget));
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
        console.log('newCat');
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
        console.log('Halllo', tasks);
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
            <div class="board-overlay-main-container"></div>
        </div>
    </div>`;
}

function renderTaskOverlay(id) {
    const element = getObjectById(tasks, `${id}`);
    console.log(element, `${id}`, tasks);
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
        a += `<div>
                <b>Assigned to:</b> <br>`;
        for (const collab of element.collaborators) {
            [name, surname] = collab.name;
            initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
            a += `<div class="flex-row m-l-12 m-t-12"> 
            <div class="initials m-r-10" style="background-color: ${collab.color}">${initials}</div> ${collab.name}
            </div>`;
        }
        a += `</div>`;
    }
    if (element.subtask) {
        a += `<div class="task-subtask-container m-t-12" id="subtasks-overlay">
                <b>Subtasks</b>
            <div class="subtask-inner-container m-t-20">`;
        for (const subtask of element.subtask) {
            const name = subtask.name;
            const state = subtask.state;
            const id = subtask.id;
            a += `<div class="subtask-inner-inner-container">
            <img src="../assets/img/${subtask.state}CheckButton.svg" onclick="switchSubtaskState(${element.id},${subtask.id})"> 
            &ensp;${subtask.name}
            </div>`
        }
        a += `</div>`;
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

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function switchSubtaskState(taskId, subtaskId) {
    const element = getObjectById(tasks, `${taskId}`);
    const subtask = getObjectById(element.subtask, subtaskId)
    console.log(element);
    if (subtask.state === 'done') {
        subtask.state = 'open';
    } else { subtask.state = 'done' }
    renderTaskOverlay(taskId);
    console.log('hallo');
    renderTasks(element);
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
    tasks.splice(taskIndex,1);
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
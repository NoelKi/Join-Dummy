let currentDraggedElement;

let tasks = [{
    'id': 0,
    'title': 'Putzen',
    'kind': 'Technical Task',
    'taskColor': 'blue',
    'description': 'BlaBliBulb',
    'category': 'inProgress',
    'priority': 'medium',
    'collaborators': [{'name':'Anche Apfelgrün',
                        'color':'#C3FF2B'},
                         {'name':'Rosi Rot',
                         'color':'#FF4646'}]
}, {
    'id': 1,
    'title': 'Kochen',
    'kind': 'User Story',
    'taskColor': 'orange',
    'description': 'BlaBliBulb',
    'category': 'toDo',
    'priority': 'low',
    'collaborators': [{'name':'Anche Apfelgrün',
                        'color':'#FF7A00'}]
}, {
    'id': 2,
    'title': 'Einkaufen',
    'kind': 'User Story',
    'taskColor': 'orange',
    'description': 'BlaBliBulb',
    'category': 'awaitFeedback',
    'priority': 'high',
    'collaborators': [{'name':'Anche Apfelgrün',
                        'color':'#1FD7C1'},
                        {'name':'Rosi Rot',
                        'color':'#00BEE8'}]

}];

function renderTasks() {
    // render to do 
    renderToDo();
    // render in progress
    renderInProgress();
    // render in await feedback
    renderAwaitFeedback();
    // render in done
    renderDone();
    // render initials 

}

function renderToDo() {
    let toDo = tasks.filter(t => t['category'] == 'toDo');
    document.getElementById('board-toDo').innerHTML = '';
    for (let index = 0; index < toDo.length; index++) {
        const element = toDo[index];
        document.getElementById('board-toDo').innerHTML += renderTaskHtml(element);
    }
    if (toDo.length === 0) {
        document.getElementById('board-toDo').innerHTML = renderEmptyBox('to do');
    }
}

function renderAwaitFeedback() {
    let awaitFeedback = tasks.filter(t => t['category'] == 'awaitFeedback');

    document.getElementById('board-awaitFeedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('board-awaitFeedback').innerHTML += renderTaskHtml(element);

    }
    if (awaitFeedback.length === 0) {
        document.getElementById('board-awaitFeedback').innerHTML = renderEmptyBox('await feedback');
    }
}

function renderDone() {
    let done = tasks.filter(t => t['category'] == 'done');

    document.getElementById('board-done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('board-done').innerHTML += renderTaskHtml(element);
    }
    if (done.length === 0) {
        document.getElementById('board-done').innerHTML = renderEmptyBox('done');
    }
}

function renderInProgress() {
    let inProgress = tasks.filter(t => t['category'] == 'inProgress');

    document.getElementById('board-inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('board-inProgress').innerHTML += renderTaskHtml(element);
    }
    if (inProgress.length === 0) {
        document.getElementById('board-inProgress').innerHTML = renderEmptyBox('in progress');
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    tasks[currentDraggedElement]['category'] = category;
    renderTasks();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

function renderTaskHtml(element) {
    let a = `<div class="task-container" draggable="true" ondragstart="startDragging(${element['id']})">
        <div class="task-kind-container" style="background-color: ${element.taskColor}">${element.kind}</div>
        <div class="task-content-container">
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>
            <div class="task-subtask" id="task-subtask">
                <div class="task-progress-bar">
                    <div class="task-bar"></div>    
                </div>
                <div id="subtask">1/2 Subtasks</div>
            </div>
            <div class="task-bottom-container">
            <div class="task-collaborators" id="task-collaborators-${element.id}">`;
    for (const collab of element.collaborators) {
        console.log(collab);
        [name, surname] = collab.name;

        initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
        a += `<div class="initials" style="background-color: ${collab.color}">${initials}</div>`
    }
    a += `</div>
                <div class="task-priority" id="task-priority">
                    <img src="../assets/img/priority${element.priority.toUpperCase()}.svg">
                </div>
            </div>
        </div>
    </div>`;
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

function openAddTaskOverlay() {
    const content = document.getElementById('board-overlay-section');
    content.style.display = 'block';
    content.innerHTML = renderAddTaskOverlay();
}

function renderAddTaskOverlay() {   
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


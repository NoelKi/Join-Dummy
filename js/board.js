let currentDraggedElement;

let tasks = [{
    'id': 0,
    'title': 'Putzen',
    'kind': 'Technical Task',
    'taskColor': 'blue',
    'description': 'BlaBliBulb',
    'category': 'toDo',
    'priority': 'medium'
}, {
    'id': 1,
    'title': 'Kochen',
    'kind': 'User Story',
    'taskColor': 'orange',
    'description': 'BlaBliBulb',
    'category': 'done',
    'priority': 'low'
}, {
    'id': 2,
    'title': 'Einkaufen',
    'kind': 'User Story',
    'taskColor': 'orange',
    'description': 'BlaBliBulb',
    'category': 'awaitFeedback',
    'priority': 'high'
}];

function renderTasks() {
    // render to do 
    let toDo = tasks.filter(t => t['category'] == 'toDo');
    document.getElementById('board-toDo').innerHTML = '';

    for (let index = 0; index < toDo.length; index++) {
        const element = toDo[index];
        document.getElementById('board-toDo').innerHTML += renderTaskHtml(element);
    }
    // render in progress
    let inProgress = tasks.filter(t => t['category'] == 'inProgress');

    document.getElementById('board-inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('board-inProgress').innerHTML += renderTaskHtml(element);
    }
    // render in await feedback
    let awaitFeedback = tasks.filter(t => t['category'] == 'awaitFeedback');

    document.getElementById('board-awaitFeedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('board-awaitFeedback').innerHTML += renderTaskHtml(element);
    }
    // render in done
    let done = tasks.filter(t => t['category'] == 'done');

    document.getElementById('board-done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('board-done').innerHTML += renderTaskHtml(element);
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
    return `
    <div class="task-container" draggable="true" ondragstart="startDragging(${element['id']})">
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
                <div class="task-collaborators" id="task-collaborators">
                    <div class="initials">SM</div>
                    <div class="initials">SM</div>
                </div>
                <div class="task-priority" id="task-priority">
                    <img src="../assets/img/priority${element.priority.toUpperCase()}.svg">
                </div>
            </div>
        </div>
    </div>`;
}
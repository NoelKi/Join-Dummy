let currentDraggedElement;

let tasks = [{
    'id': 0,
    'date':'10/21/2024',
    'title': 'Putzen',
    'kind': 'Technical Task',
    'taskColor': '#0038FF',
    'description': 'BlaBliBulb',
    'category': 'inProgress',
    'priority': 'Medium',
    'collaborators': [{'name':'Anche Apfelgrün',
                        'color':'#C3FF2B'},
                         {'name':'Rosi Rot',
                         'color':'#FF4646'}],
    'subtask': [{'name':'Küche putzen',
                'state':'done',
                'id': 2023},
                {'name':'Flur putzen',
                'state':'done',
                'id': 206},]
}, {
    'id': 1,
    'date':'10/21/2024',
    'title': 'Kochen',
    'kind': 'User Story',
    'taskColor': '#FF7A00',
    'description': 'BlaBliBulb',
    'category': 'toDo',
    'priority': 'Low',
    'collaborators': [{'name':'Anche Apfelgrün',
                        'color':'#FF7A00'}],
    'subtask': [{'name':'Abendbrot kochen',
                'state':'done',
                'id': 2029},
                {'name':'Frühstück kochen',
                'state':'open',
                'id': 2028},]
}, {
    'id': 2,
    'date':'10/21/2024',
    'title': 'Einkaufen',
    'kind': 'User Story',
    'taskColor': '#FF7A00',
    'description': 'BlaBliBulb',
    'category': 'awaitFeedback',
    'priority': 'Urgent',
    'collaborators': [{'name':'Anche Apfelgrün',
                        'color':'#1FD7C1'},
                        {'name':'Rosi Rot',
                        'color':'#00BEE8'}],
    'subtask': []
}, {
    'id': 3,
    'date':'10/24/2024',
    'title': 'Dachrinne Reinigen',
    'kind': 'Technical Task',
    'taskColor': '#0038FF',
    'description': 'BlaBliBulb',
    'category': 'awaitFeedback',
    'priority': 'Urgent',
    'collaborators': [],
    'subtask': []
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
    let a = `<div class="task-container" draggable="true" ondragstart="startDragging(${element['id']})" onclick="renderTaskOverlay(${element['id']});">
        <div class="task-kind-container" style="background-color: ${element.taskColor}">${element.kind}</div>
        <div class="task-content-container">
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>`;
    if (element.subtask.length > 1) {
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
    for (const collab of element.collaborators) {
        [name, surname] = collab.name;
        initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
        a += `<div class="initials" style="background-color: ${collab.color}">${initials}</div>`
    }
    a += `</div>
                <div class="task-priority" id="task-priority">
                    <img src="../assets/img/priority${element.priority}.svg">
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
    const element = getObjectById(tasks,id);
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
    if (element.collaborators.length > 0) {
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
    if (element.subtask.length > 0) {
        a += `<div class="task-subtask-container m-t-12" id="subtasks-overlay">
                <b>Subtasks</b>
            <div class="subtask-inner-container m-t-20">`;
        for (const subtask of element.subtask) {
            const name = subtask.name;
            const state = subtask.state; 
            const id = subtask.id;
            a += `<div class="subtask-inner-inner-container">
            <img src="../assets/img/${subtask.state}CheckButton.svg" onclick="switchSubtaskState(${element.id},${subtask.id})"> &ensp;${subtask.name}
            </div>`
        }
        a += `</div>`;
    } 
    a += `  <div class="task-edit-container">
                <div class="delete-task-overlay-btn">
                    <img src="../assets/img/bin.svg"> Delete 
                </div>
                <div class="horizontal-separator"></div>
                <div class="edit-task-overlay-btn">
                    <img src="../assets/img/pencil.svg"> Edit
                </div>
            </div>
        </div>
    </div>`;
    return a;
}

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function switchSubtaskState(taskId,subtaskId) {
    const element = getObjectById(tasks,taskId);
    const subtask = getObjectById(element.subtask,subtaskId)
    if (subtask.state === 'done') {
        subtask.state = 'open';
    } else {subtask.state = 'done'}
    renderTaskOverlay(taskId);
    console.log('hallo');
    renderTasks(element);
}
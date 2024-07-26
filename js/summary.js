function init() {
  getUserLists();
  onloadFunc();
  upcomingDate();
  includeHTML();
  updateGreeting();
  userFirstLetter();
}

async function getUserLists() {
  try {
    CURRENT_USER_DATA = await getUserData(USER_ID);
    if (!CURRENT_USER_DATA.contacts) {
      contacts = [];
    } else {
      contacts = CURRENT_USER_DATA.contacts;
    }
    if (!CURRENT_USER_DATA.tasks) {
      tasks = [];
    } else {
      tasks = CURRENT_USER_DATA.tasks;
      countTasks(CURRENT_USER_DATA.tasks);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}

async function onloadFunc() {
  const userId = await loadUserIdLocalStorage();
  const userName = JSON.parse(localStorage.getItem('userName'));

  if (userId && userName) {
    updateGreeting(userName);
  } else {
    updateGreeting('Guest!');
  }
}

function updateGreeting(username) {
  let greetingElement = document.getElementById("greeting");
  greetingElement.innerHTML = `Good morning, &nbsp; <span>${username}</span>`;
}

function countTasks(tasks) {
  let totalCount = tasks.length;
  let toDoCount = tasks.filter(task => task.category === 'toDo').length;
  let inProgressCount = tasks.filter(task => task.category === 'inProgress').length;
  let awaitFeedbackCount = tasks.filter(task => task.category === 'awaitFeedback').length;
  let doneCount = tasks.filter(task => task.category === 'done').length;

  document.getElementById('todo-number').textContent = toDoCount;
  document.getElementById('bord-tasks-number').textContent = totalCount;
  document.getElementById('progress-task-number').textContent = inProgressCount;
  document.getElementById('feedback-number').textContent = awaitFeedbackCount;
  document.getElementById('done-number').textContent = doneCount;
}

function upcomingDate() {
  document.getElementById('due-date').textContent = new Date().toLocaleDateString('en-EN',
    { year: 'numeric', month: 'long', day: 'numeric' });
}


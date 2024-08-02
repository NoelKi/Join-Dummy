function init() {
  getUserLists();
  onloadFunc();
  upcomingDate();
  includeHTML();
  updateGreeting();
}

//async function getUserLists() {
//  try {
//    CURRENT_USER_DATA = await getUserData(USER_ID);
//    setUserInitals();
//    if (!CURRENT_USER_DATA.contacts) {
//      contacts = [];
//    } else {
//      contacts = CURRENT_USER_DATA.contacts;
//    }
//    if (!CURRENT_USER_DATA.tasks) {
//      tasks = [];
//    } else {
//      tasks = CURRENT_USER_DATA.tasks;
//      countTasks(CURRENT_USER_DATA.tasks);
//    }
//  } catch (error) {
//    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
//  }
//}

async function getUserLists() {
  try {
    const userData = await getUserData(USER_ID);
    CURRENT_USER_DATA = userData;
    setUserInitals();

    const tasks = userData.tasks || [];
    countTasks(tasks);
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
  let currentTime = new Date().getHours();
  let greeting;

  if (currentTime < 12) {
    greeting = "Good morning";
  } else if (currentTime < 17) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  greetingElement.innerHTML = `${greeting}, &nbsp; <span>${username}</span>`;
}

function countTasks(tasks) {
  const taskCounts = {};
  tasks.forEach((task) => {
    taskCounts[task.category] = (taskCounts[task.category] || 0) + 1;
  });

  document.getElementById('todo-number').textContent = taskCounts.toDo || 0;
  document.getElementById('bord-tasks-number').textContent = tasks.length;
  document.getElementById('progress-task-number').textContent = taskCounts.inProgress || 0;
  document.getElementById('feedback-number').textContent = taskCounts.awaitFeedback || 0;
  document.getElementById('done-number').textContent = taskCounts.done || 0;
}

function upcomingDate() {
  document.getElementById('due-date').textContent = new Date().toLocaleDateString('en-EN',
    { year: 'numeric', month: 'long', day: 'numeric' });
}


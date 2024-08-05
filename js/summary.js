function init() {
  includeHTML();
  getUserLists();
  onloadFunc();
}


async function getUserLists() {
  try {
    const userData = await getUserData(USER_ID);
    CURRENT_USER_DATA = userData;
    setUserInitals();

    const tasks = userData.tasks || [];
    countTasks(tasks);
    updateUrgentTask(tasks);
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}


async function onloadFunc() {
  const userId = await loadUserIdLocalStorage();
  const userName = JSON.parse(localStorage.getItem('userName'));

  if (userId && userName) {
    updateGreeting(capitalizeName(userName));
  } else {
    updateGreeting('Guest');
  }
}


function capitalizeName(name) {
  return name.split(' ').map(capitalizeFirstLetter).join(' ');
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


function updateGreeting(username) {
  const greetingElement = document.getElementById("greeting");
  const currentTime = new Date().getHours();
  let greeting;
  if (currentTime < 12) {
    greeting = "Good morning";
  } else if (currentTime < 17) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  if (username === "Guest") {
    greetingElement.innerHTML = `<span class="greeting-guest">${greeting}</span>`;
  } else {
    greetingElement.innerHTML = `${greeting}, &nbsp; <span>${username}</span>`;
  }
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


function getUrgentTasks(tasks) {
  return tasks.filter(task => task.priority === 'urgent' && task.date);
}


function sortTasksByDate(tasks) {
  return tasks.sort((a, b) => a.date - b.date);
}


function getClosestDeadline(tasks) {
  return tasks.reduce((closest, current) => {
    return current.date < closest.date ? current : closest;
  }, tasks[0]);
}


function formatDeadline(date) {
  return new Date(date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' });
}


function updateUrgentTask(tasks) {
  const urgentTasks = getUrgentTasks(tasks);
  const closestTask = getClosestDeadline(urgentTasks);

  document.getElementById('urgent-number').textContent = urgentTasks.length;
  if (closestTask) {
    document.getElementById('due-date').textContent = formatDeadline(closestTask.date);
  } else {
    document.getElementById('due-date').textContent = '';
  }
}


function loadBoard() {
  window.location.href = '/pages/board.html';
}
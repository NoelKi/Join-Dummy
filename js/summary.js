function init() {
  includeHTML();
  getUserLists();
  onloadFunc();
}


async function getUserLists() {
  try {
    const userData = await getUserData(USER_ID);
    const tasks = userData.tasks || [];
    CURRENT_USER_DATA = userData;
    setUserInitals();
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
  return tasks.filter((task) => task.priority === 'Urgent' && task.category !== 'done');
}


function getClosestDeadline(tasks) {
  return tasks.reduce((closest, current) => {
    return new Date(current.date) < new Date(closest.date) ? current : closest;
  }, tasks[0]);
}


function formatDeadline(date) {
  return new Date(date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' });
}


function updateUrgentTask(tasks) {
  const urgentTasks = getUrgentTasks(tasks);

  if (urgentTasks.length > 0) {
    const closestTask = getClosestDeadline(urgentTasks);
    document.getElementById('urgent-number').textContent = urgentTasks.length;
    document.getElementById('due-date').textContent = formatDeadline(closestTask.date);
  } else {
    document.getElementById('urgent-number').textContent = '0';
    document.getElementById('due-date').textContent = '';
  }
}


function loadBoard() {
  window.location.href = '/pages/board.html';
}
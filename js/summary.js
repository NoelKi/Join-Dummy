/**
 * Initializes the application by including HTML components, retrieving user lists, and executing onload functions.
 * @function init
 */
function init() {
  includeHTML();
  getUserLists();
  onloadFunc();
}


/**
 * Fetches user data and initializes user-related information.
 * @async
 * @function getUserLists
 * @throws Will throw an error if user data cannot be fetched.
 */
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


/**
 * Loads user ID and user name from local storage and updates the greeting message.
 * @async
 * @function onloadFunc
 */
async function onloadFunc() {
  const userId = await loadUserIdLocalStorage();
  const userName = JSON.parse(localStorage.getItem('userName'));

  if (userId && userName) {
    updateGreeting(capitalizeName(userName));
  } else {
    updateGreeting('Guest');
  }
}


/**
 * Updates the greeting message on the page based on the current time and user name.
 * @function updateGreeting
 * @param {string} username - The name of the user to greet.
 */
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


/**
 * Counts the number of tasks in each category and updates the corresponding elements on the page.
 * @function countTasks
 * @param {Object[]} tasks - The list of tasks to count.
 */
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


/**
 * Updates the urgent task information on the page.
 * @function updateUrgentTask
 * @param {Object[]} tasks - The list of tasks to check for urgency.
 */
function updateUrgentTask(tasks) {
  const activeTasks = tasks.filter(task => task.category !== 'done');
  const tasksDueInNextSevenDays = getTasksDueInNextSevenDays(activeTasks);
  document.getElementById('urgent-number').textContent = tasksDueInNextSevenDays.length;

  if (tasksDueInNextSevenDays.length > 0) {
    const closestTask = getClosestDeadline(tasksDueInNextSevenDays);
    document.getElementById('due-date').textContent = formatDeadline(closestTask.date);
  } else {
    document.getElementById('due-date').textContent = 'No urgent Tasks';
  }
}


/**
 * Capitalizes the first letter of each word in a name.
 * @function capitalizeName
 * @param {string} name - The name to capitalize.
 * @returns {string} - The capitalized name.
 */
function capitalizeName(name) {
  return name.split(' ').map(capitalizeFirstLetter).join(' ');
}


/**
 * Capitalizes the first letter of a string.
 * @function capitalizeFirstLetter
 * @param {string} string - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


/**
 * Retrieves tasks with deadlines within the next 7 days.
 * @function getTasksDueInNextSevenDays
 * @param {Object[]} tasks - The list of tasks to filter.
 * @returns {Object[]} - The list of tasks due in the next 7 days.
 */
function getTasksDueInNextSevenDays(tasks) {
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= now && taskDate <= sevenDaysFromNow;
  });
}


/**
 * Finds the task with the closest deadline.
 * @function getClosestDeadline
 * @param {Object[]} tasks - The list of tasks to check.
 * @returns {Object} - The task with the closest deadline.
 */
function getClosestDeadline(tasks) {
  if (tasks.length === 0) return {};

  return tasks.reduce((closest, current) => {
    const closestDate = new Date(closest.date);
    const currentDate = new Date(current.date);
    return currentDate < closestDate ? current : closest;
  });
}


/**
 * Formats a date string to a more readable format.
 * @function formatDeadline
 * @param {string} date - The date string to format.
 * @returns {string} - The formatted date string.
 */
function formatDeadline(date) {
  const formattedDate = new Date(date);
  return isNaN(formattedDate) ? 'Invalid date' : formattedDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
}


/**
 * Redirects the user to the board page.
 * @function loadBoard
 */
function loadBoard() {
  window.location.href = '/pages/board.html';
}
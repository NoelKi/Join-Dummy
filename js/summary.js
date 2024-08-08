/**
 * Initializes the application by including HTML components, retrieving user lists, and executing onload functions.
 * This function serves as the entry point of the application. It initializes the necessary HTML components,
 * retrieves user-specific data, and sets up the application state by calling `includeHTML`, `getUserLists`, and `onloadFunc`.
 * @function init
 */
function init() {
  includeHTML();
  getUserLists();
  onloadFunc();
}


/**
 * Fetches user data and initializes user-related information.
 * This asynchronous function fetches user data from the server using the provided user ID.
 * It then initializes user-specific data, such as tasks, and updates the application state.
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
 * This function retrieves the user ID and user name from local storage and updates the greeting message
 * on the page based on the retrieved data. If the user data is not available, it defaults to greeting a 'Guest'.
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
 * This function updates the greeting message displayed on the page.
 * The greeting changes based on the time of day (morning, afternoon, evening) and includes the user's name.
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
 * This function categorizes and counts the tasks based on their status and updates the corresponding
 * HTML elements with these counts.
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
 * This function filters the tasks to identify those that are due within the next 7 days
 * and updates the HTML elements to reflect the number of urgent tasks and the closest deadline.
 * @function updateUrgentTask
 * @param {Object[]} tasks - The list of tasks to check for urgency.
 */
function updateUrgentTask(tasks) {
  const activeTasks = tasks.filter(task => task.category !== 'done');
  const tasksDueInNextSevenDays = setDeadline(activeTasks);
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
 * This function takes a name string and capitalizes the first letter of each word in the name.
 * @function capitalizeName
 * @param {string} name - The name to capitalize.
 * @returns {string} - The capitalized name.
 */
function capitalizeName(name) {
  return name.split(' ').map(capitalizeFirstLetter).join(' ');
}


/**
 * Capitalizes the first letter of a string.
 * This function capitalizes the first letter of the given string and converts the rest of the string to lowercase.
 * @function capitalizeFirstLetter
 * @param {string} string - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


/**
 * Retrieves tasks with deadlines that fall within the next 7 days.
 * This function filters the provided list of tasks to include only those
 * that have a deadline from today up to 7 days in the future.
 * @function setDeadline
 * @param {Object[]} tasks - The list of tasks to filter.
 * @param {string} tasks[].date - The deadline date of the task in ISO string format.
 * @returns {Object[]} An array of tasks whose deadlines fall within the next 7 days.
 */
function setDeadline(tasks) {
  const { today, sevenDaysFromToday } = calculateDeadlineRange();
  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= today && taskDate <= sevenDaysFromToday;
  });
}


/**
 * Calculates the range of dates from today to 7 days in the future.
 * This function determines the start date (today) and the end date (7 days from today)
 * to be used for filtering tasks based on their deadlines.
 * @function calculateDeadlineRange
 * @returns {Object} An object containing the start and end dates of the range.
 * @property {Date} today - The start date of the range, set to the start of today.
 * @property {Date} sevenDaysFromToday - The end date of the range, set to 7 days from today.
 */
function calculateDeadlineRange() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 7);
  return { today, sevenDaysFromToday };
}


/**
 * Finds the task with the closest deadline.
 * This function takes a list of tasks and returns the one with the closest deadline.
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
 * This function takes a date string and converts it to a more readable format (e.g., "January 1, 2024").
 * If the date is invalid, it returns 'Invalid date'.
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
 * This function redirects the user to the board page by updating the `window.location.href`.
 * @function loadBoard
 */
function loadBoard() {
  window.location.href = 'board.html';
}
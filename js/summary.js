function init() {
  onloadFunc();
  upcomingDate();
  includeHTML();
  countTasks(tasksExample);
  updateGreeting();
  userFirstLetter()
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

  document.getElementById('ToDoNumber').textContent = toDoCount;
  document.getElementById('bordTasksNumber').textContent = totalCount;
  document.getElementById('progressTaskNumber').textContent = inProgressCount;
  document.getElementById('feedbackNumber').textContent = awaitFeedbackCount;
  document.getElementById('doneNumber').textContent = doneCount;
}

function upcomingDate() {
  document.getElementById('dueDate').textContent = new Date().toLocaleDateString('en-EN',
    { year: 'numeric', month: 'long', day: 'numeric' });
}
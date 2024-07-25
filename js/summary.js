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
    updateGreeting(`${userName}`);
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
function init(){
  upcomingDate();
  onloadFunc();
  countTasks(tasksExample);
  includeHTML();
}

async function onloadFunc() {
  const userResponse = await fetchUsers();
  let userKeysArray = Object.keys(userResponse);
  console.log(userKeysArray);
  //countTasks(userResponse);
}

//document.addEventListener("DOMContentLoaded", function() {
//  includeHTML();
//  updateGreeting();
//  onloadFunc(); // Call onloadFunc when the DOM is ready
//});

function updateGreeting() {
  let greetingElement = document.getElementById("greetingUser");
  let now = new Date();
  let hours = now.getHours();

  if (hours >= 7 && hours < 11) {
    greetingElement.textContent = "Good Morning";
  } else if (hours >= 11 && hours < 18) {
    greetingElement.textContent = "Hello";
  } else if (hours >= 18 && hours < 23) {
    greetingElement.textContent = "Good Evening";
  } else {
    greetingElement.textContent = "Good Night";
  }
}

setInterval(updateGreeting, 60000);

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
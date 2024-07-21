document.addEventListener("DOMContentLoaded", function() {
  includeHTML();
  updateGreeting();
  renderTaskSummary();
});

function upcomingDate() {
  document.getElementById('dueDate').textContent = new Date().toLocaleDateString('en-EN',
    { year: 'numeric', month: 'long', day: 'numeric' });
}
upcomingDate();



function updateGreeting() {
  let greetingElement = document.getElementById("welcome-time");
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

updateGreeting();

setInterval(updateGreeting, 60000);

//async function fetchTasks() {
//  try {
//    const response = await fetch(`${BASE_URL}users.json`);
//    const tasks = await response.json();
//    return tasks;
//  } catch (error) {
//    console.error('Error fetching tasks:', error);
//    return null;
//  }
//}

async function updateTaskSummary() {
  const tasks = await fetchUsers();
  if (!tasks) {
    console.error('No tasks found');
    return;
  }

  const taskCounts = {
    toDo: 0,
    inProgress: 0,
    awaitFeedback: 0,
    done: 0,
  };

  Object.values(tasks).forEach((task) => {
    taskCounts[task.status]++;
  });

  document.getElementById('ToDoNumber').innerText = taskCounts.toDo;
  document.getElementById('progressTaskNumber').innerText = taskCounts.inProgress;
  document.getElementById('feedbackNumber').innerText = taskCounts.awaitFeedback;
  document.getElementById('doneNumber').innerText = taskCounts.done;
  document.getElementById('boardTasksNumber').innerText = Object.keys(tasks).length;
}
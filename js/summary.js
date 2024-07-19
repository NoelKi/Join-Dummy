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


USER_ID = "";

function loadUserIdLocalStorage() {
  const idAsText = localStorage.getItem("userId");
  if (!idAsText) return (window.location.href = "login.html");
  USER_ID = JSON.parse(idAsText);
}

loadUserIdLocalStorage();

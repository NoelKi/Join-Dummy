async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }

  setActive();
  setActiveSmall()
}

function setActive() {
  const pathName = window.location.pathname;
  switch (true) {
    case pathName.includes("index.html"):
      document.getElementById("index-active").className += " active";
      break;
    case pathName.includes("contacts.html"):
      document.getElementById("contacts-active").className += " active";
      break;
    case pathName.includes("addTask.html"):
      document.getElementById("addTask-active").className += " active";
      break;
    case pathName.includes("board.html"):
      document.getElementById("board-active").className += " active";
      break;
    case pathName.includes("privacyPolicy.html"):
      document.getElementById("privacy-police-active").className +=
        "bottom-links-active";
      break;
    case pathName.includes("legalNotice.html"):
      document.getElementById("legal-notice-active").className +=
        "bottom-links-active";
      break;
    case pathName.includes("privacyPolicyGuest.html"):
      document.getElementById("privacy-police-active").className +=
        "bottom-links-active";
      break;
    case pathName.includes("legalNoticeGuest.html"):
      document.getElementById("legal-notice-active").className +=
        "bottom-links-active";
      break;
  }
}


function setActiveSmall() {
  const pathName = window.location.pathname;
  let activeId = '';

  switch (true) {
    case pathName.includes("index.html"):
      activeId = "index-active-bottom";
      break;
    case pathName.includes("contacts.html"):
      activeId = "contacts-active-bottom";
      break;
    case pathName.includes("addTask.html"):
      activeId = "addTask-active-bottom";
      break;
    case pathName.includes("board.html"):
      activeId = "board-active-bottom";
      break;
  }

  if (activeId) {
    const activeElement = document.getElementById(activeId);
    const images = activeElement.getElementsByTagName('img');
    for (let img of images) {
      if (img.classList.contains('unactive-bottom')) {
        img.style.display = 'none';
      } else if (img.classList.contains('active-bottom')) {
        img.style.display = 'block';
      }
    }
  }
}

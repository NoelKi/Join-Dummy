let isPopupVisible = false;

function myFunction() {
  const popupNav = document.getElementById("popup-nav");
  isPopupVisible = !isPopupVisible;
  popupNav.style.display = isPopupVisible ? "block" : "none";
  if (isPopupVisible) {
    document.addEventListener("keydown", keyPress);
    document.addEventListener("click", clickOutside);
  } else {
    document.removeEventListener("keydown", keyPress);
    document.removeEventListener("click", clickOutside);
  }
}

function keyPress(e) {
  switch (e.key) {
    case "Escape":
      myFunction();
      break;
  }
}

function clickOutside(event) {
  const popupNav = document.getElementById("popup-nav");
  const toggleNav = document.getElementById("toggle-nav");
  if (!popupNav.contains(event.target) && event.target !== toggleNav) {
    myFunction();
  }
}

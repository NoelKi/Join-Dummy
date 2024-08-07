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
  if (e.key === "Escape") {
    myFunction();
  }
}

function clickOutside(e) {
  if (!document.getElementById("profil-btn").contains(e.target) &&
    !document.getElementById("popup-nav").contains(e.target)) {
    myFunction();
  }
}

function setUserInitals() {
  const fullName = CURRENT_USER_DATA.name;
  const [name, surname = ''] = fullName.split(' ');
  const initials = getFirstLetterOfName(name) + getFirstLetterOfName(surname);
  document.getElementById("profil-btn").innerHTML = initials;
}
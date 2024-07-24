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

async function userFirstLetter() {
  const { name: fullName } = Object.values(await fetchUsers())[0];
  const [name, surname] = fullName.split(' ');
  const initials = surname ? `${name[0].toUpperCase()}${surname[0].toUpperCase()}` : fullName[0].toUpperCase();
  document.getElementById("profil-btn").innerHTML = initials;
  console.log(fullName);
}
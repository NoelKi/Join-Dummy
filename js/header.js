let isPopupVisible = false;

function myFunction() {
  const popupNav = document.getElementById("popup-nav");
  isPopupVisible = !isPopupVisible;
  popupNav.style.display = isPopupVisible ? "block" : "none";
  if (isPopupVisible) {
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
  } else {
    document.removeEventListener('keydown', keyPress);
    document.removeEventListener('click', clickOutside);
  }
}

function keyPress(e) {
  switch (e.key) {
    case 'Escape':
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

//document.addEventListener("DOMContentLoaded", function () {
//  const toggleNav = document.getElementById("toggle-nav");
//  const popupNav = document.getElementById("popup-nav");
//
//  function togglePopupNav() {
//    if (popupNav.style.display === "none" || popupNav.style.display === "") {
//      popupNav.style.display = "block";
//    } else {
//      popupNav.style.display = "none";
//    }
//  }
//
//  function closePopupNav(event) {
//    if (!popupNav.contains(event.target) && !toggleNav.contains(event.target)) {
//      popupNav.style.display = "none";
//    }
//  }
//
//  toggleNav.addEventListener("click", function (event) {
//    event.stopPropagation();
//    togglePopupNav();
//  });
//
//  document.addEventListener("click", function (event) {
//    closePopupNav(event);
//  });
//
//  document.addEventListener("keydown", function (event) {
//    if (event.key === "Escape") {
//      popupNav.style.display = "none";
//    }
//  });
//});
//
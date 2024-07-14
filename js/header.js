function myFunction() {
  const popupNav = document.getElementById("popup-nav");
  if (popupNav.style.display === "block") {
    popupNav.style.display = "none";
    document.removeEventListener('keydown', handleKeyPress);
    isPopupVisible = false;
  } else {
    popupNav.style.display = "block";
    document.addEventListener('keydown', handleKeyPress);
    isPopupVisible = true;
  }
}

function handleKeyPress(e) {
  switch (e.key) {
    case 'Escape':
      closeNav();
      break;
  }
}

function closeNav() {
  const popupNav = document.getElementById("popup-nav");
  popupNav.style.display = "none";
  isPopupVisible = false;
}

document.addEventListener('click', function(event) {
  const popupNav = document.getElementById("popup-nav");
  const toggleNav = document.getElementById("toggle-nav");
  if (isPopupVisible &&!popupNav.contains(event.target) && event.target!== toggleNav) {
    closeNav();
  }
});


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
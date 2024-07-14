document.addEventListener("DOMContentLoaded", function () {
  const toggleNav = document.getElementById("toggle-nav");
  const popupNav = document.getElementById("popup-nav");

  function togglePopupNav() {
    if (popupNav.style.display === "none" || popupNav.style.display === "") {
      popupNav.style.display = "block";
    } else {
      popupNav.style.display = "none";
    }
  }

  function closePopupNav(event) {
    if (!popupNav.contains(event.target) && !toggleNav.contains(event.target)) {
      popupNav.style.display = "none";
    }
  }

  toggleNav.addEventListener("click", function (event) {
    event.stopPropagation();
    togglePopupNav();
  });

  document.addEventListener("click", function (event) {
    closePopupNav(event);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      popupNav.style.display = "none";
    }
  });
});

clearTaskBtn.addEventListener("click", function () {
  clearAllInputs();
  checkInputs();
});

selectOption.addEventListener("click", function () {
  selectBox.classList.toggle("active-task");
});

optionList.forEach(function (optionListSingle) {
  optionListSingle.addEventListener("click", function () {
    text = this.textContent;
    selectValue.value = text;
    selectBox.classList.remove("active-task");
    checkInputs();
  });
});

titleInput.addEventListener("focusout", function () {
  if (titleInput.value.trim() === "") {
    titleError.style.display = "inline";
    titleInput.style.borderBottomColor = "#ff8190";
  } else {
    titleError.style.display = "none";
    titleInput.style.borderBottomColor = "";
  }
  checkInputs();
});

dateInput.addEventListener("focusout", function () {
  if (dateInput.value.trim() === "") {
    dateError.style.display = "inline";
    dateInput.style.borderBottomColor = "#ff8190";
    dateInput.style.color = "black";
  } else {
    dateError.style.display = "none";
    dateInput.style.borderBottomColor = "";
    dateInput.style.color = "black";
  }
  checkInputs();
});

document
  .getElementById("task-form")
  .addEventListener("submit", function (event) {
    if (titleInput.value.trim() === "" || dateInput.value.trim() === "") {
      event.preventDefault();
      if (titleInput.value.trim() === "") {
        titleError.style.display = "inline";
      }
      if (dateInput.value.trim() === "") {
        dateError.style.display = "inline";
      }
    }
  });

document.addEventListener("click", (e) => {
  if (!selectValue.contains(e.target)) {
    generatedContatcs.classList.remove("active-task");
  }
});

generateList.addEventListener("click", (e) => {
  e.stopPropagation();
});

document
  .getElementById("option-search")
  .addEventListener("input", function (event) {
    let searchName = event.target.value;
    let filteredContacts = filterContacts(searchName);
    loadContactList(filteredContacts);
  });

document.querySelectorAll(".contact-item").forEach(function (item) {
  item.addEventListener("click", function () {
    let textDiv = item.querySelector(".contact-text");
    selectValue.value = textDiv.textContent;
    selectBox.classList.remove("active-task");
    checkInputs();
  });
});

selectCategoryOption.addEventListener("click", function (event) {
  toggleCategoryList();
  event.stopPropagation();
});

optionSearch.addEventListener("click", function (event) {
  toggleCategoryList();
  event.stopPropagation();
});

document.addEventListener("click", function (event) {
  if (!selectBoxCategory.contains(event.target)) {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  }
});

categoryList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    selectCategoryOption.querySelector("input").value = e.target.textContent;
    categoryList.style.display = "none";
    checkInputs();
  }
});

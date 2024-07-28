function generateContactHTML(contact, index, selectedClass, initials) {
    return `
      <div class="contact-task-assign ${selectedClass}" data-index="${index}" data-id="${contact.id}">
        <div class="icon-name-contact center-flexbox">
          <div class="initials-task" style="background-color: ${contact.color};">${initials}</div>
          <div class="contact-text-task">${contact.name} ${contact.surname}</div>
        </div>
        <div class="check-box-task">
          <img src="../assets/img/${selectedClass ? 'checkedTaskHtml.svg' : 'checkBoxTaskHtml.svg'}">
        </div>
      </div>
    `;
  }

  function getSubtaskInputHTML() {
    return `
      <div class="input-positioning" id="subtask-input-wrapper">
        <input class="subtask-css-input" id="subtask-input-field" type="text" placeholder="Add subtask" />
        <div class="center-flexbox">
          <div class="subtask-add-icons">
            <div class="icons-subtask center-flexbox"><img onclick="clearInputSubtask()" src="../assets/img/clear_subtask.svg" alt=""></div>
            <div class="separator-subtask"></div>
            <div class="icons-subtask center-flexbox"><img onclick="addSubtaskList()" src="../assets/img/subtask_save.svg" alt=""></div>
          </div>
        </div>
      </div>
    `;
  }

  function generateSubtaskHTML(task) {
    let taskWithBullet = "&#x2022; " + task.name;
  
    return `
      <div class="input-positioning-subtask" id="input-positioning-${task.id}">
        <input class="subtask-css-input" id="subtask-input-field-sub-${task.id}" type="text" value="${taskWithBullet}" readonly />
        <div class="center-flexbox">
          <div class="subtask-add-icons d-none" id="d-none-${task.id}">
            <div class="icons-subtask center-flexbox"><img src="../assets/img/bin.svg" onclick="removeSubtask(${task.id})"></div>
            <div class="separator-subtask"></div>
            <div class="icons-subtask center-flexbox"><img src="../assets/img/subtask_save.svg"></div>
          </div>
        </div>
      </div>
    `;
  }
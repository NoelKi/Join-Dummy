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
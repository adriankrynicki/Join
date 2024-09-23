/**
 * This functions adds one or more contacts to a task. 
 * 
 * @param {string} initials - initial of the contact
 * @param {string} id - id of the task
 * @param {string} color - background color of the contact initials
 */
function addContactToTask(initials, id, color) {
    let index = choosedContacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        choosedContacts.push({
            id: id,
            initial: initials,
            color: color,
        });
    }
    showChoosedContacts();
    updateCheckboxState(id);
}

/**
 * Removes Contact from a task. 
 * 
 * @param {string} id - ID of an task.
 */
function removeContactFromTask(id) {
    choosedContacts = choosedContacts.filter(contact => contact.id !== id);
    showChoosedContacts();
    updateCheckboxState(id);
}

/**
 * This function shows all assigend contacts to a task. 
 * 
 */
function showChoosedContacts() {
    let content = document.getElementById('at-selected-contacts');
    content.innerHTML = '';
    let maxVisibleContacts = 4;
    for (let i = 0; i < choosedContacts.length && i < maxVisibleContacts; i++) {
        let contact = choosedContacts[i].initial;
        let color = choosedContacts[i].color;
        content.innerHTML += `<div class="at-choosed-contact-shortcut" id="at-choosed-shortcut${i}">
                                <div class="at-contact-shortcut">${contact}</div>
                              </div>`;
        let backgroundColor = document.getElementById(`at-choosed-shortcut${i}`);
        backgroundColor.style.backgroundColor = color;
    }
    if (choosedContacts.length > maxVisibleContacts) {
        let remainingCount = choosedContacts.length - maxVisibleContacts;
        content.innerHTML += `<div class="at-choosed-contact-shortcut" style="background-color: rgb(218, 42, 224);">
                                <div class="at-contact-shortcut">+${remainingCount}</div>
                              </div>`;
    }
}

/**
 * Updates the status of a contact / checkbox.
 * 
 * @param {string} contactId - ID of the contact
 */
function updateCheckboxState(contactId) {
    const checkboxes = document.querySelectorAll(`input[data-contact-id="${contactId}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = choosedContacts.some(contact => contact.id === contactId);
    });
}

/**
 * This function shows all available contacts.
 * 
 */
function showAvailableContacts() {
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select => {
        const selectSelected = select.querySelector('.select-selected');
        const selectItems = select.querySelector('.select-items');
        const options = selectItems.querySelectorAll('.at-contact-layout');
        selectItems.style.display = 'none';
        showContactList(selectSelected, selectItems, customSelects);
        chooseContactFromList(options);

        window.addEventListener('click', function (event) {
            if (!select.contains(event.target)) {
                selectItems.style.display = 'none';
                document.getElementById('open-contact-list').classList.remove('d-none');
                document.getElementById('close-contact-list').classList.add('d-none');
            }
        });
    });
}

/**
 * This is function is used to choose a specific contact from the list. 
 * 
 * @param {*} options - An available contact.
 */
function chooseContactFromList(options) {
    options.forEach(option => {
        option.addEventListener('click', function (event) {
            event.stopPropagation();
            const checkbox = option.querySelector('input[type="checkbox"]');
            const contactId = option.querySelector('input').dataset.contactId;
            checkbox.checked = !checkbox.checked;
            toggleCheckbox(contactId);
        });
    });
}
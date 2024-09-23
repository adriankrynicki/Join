let contactColors = {};
let categoryChoosedIndex = 'false';
let categoryChoosed = '';
let subcategoriesChoosed = [];
let subtaskCompleted = [];
let choosedContacts = [];
let taskPrio = '';
let task = [];

/**
 * Initializes all components of the addtask.html.
 */
async function addTaskInit() {
    await includeHTML();
    await loadDataContacts();
    await renderAssignedToContacts();
    setupDropdownToggle();
    showAvailableContacts();
    showCategoryList();
    showInitials();
    setupContactSearchPlaceholder();
    setBackgroundColorPrio('medium');
}

/**
 * Creates the dropdown menus at the task creation process.
 * 
 */
function setupDropdownToggle() {
    const selectedElement = document.querySelector('.select-selected');
    const dropdownContainer = document.getElementById('at-contact-container');

    selectedElement.addEventListener('click', function (event) {
        event.stopPropagation();
        this.classList.toggle('select-arrow-active');
        dropdownContainer.classList.toggle('select-hide');
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.custom-select') && !event.target.closest('.select-items')) {
            dropdownContainer.classList.add('select-hide');
            selectedElement.classList.remove('select-arrow-active');
        }
    });
}

/**
 * Creates all possible contacts within the task creation process.
 * 
 */
async function renderAssignedToContacts() {
    let contentCollection = document.getElementsByClassName('select-items');

    for (let j = 0; j < contentCollection.length; j++) {
        let content = contentCollection[j];
        content.innerHTML = '';

        for (let i = 0; i < contacts.length; i++) {
            const contactName = contacts[i].name;
            let initials = contacts[i].initials;
            let color = contacts[i].profileColor;
            let id = contacts[i].id;


            content.innerHTML += generateAssignedContactsHTML(initials, contactName, id, color);
        }
    }
}

/**
 * Search function to find a specific contact.
 * 
 * @returns {string} -  error message or result of the search.
 */

function getElements() {
    const searchInput = document.getElementById('contact-search');
    const contactContainer = document.getElementById('at-contact-container');

    if (!searchInput) {
        console.error('Element mit der ID "contact-search" wurde nicht gefunden.');
        return null;
    }

    if (!contactContainer) {
        console.error('Element mit der ID "at-contact-container" wurde nicht gefunden.');
        return null;
    }

    return { searchInput, contactContainer };
}

function displayFilteredContacts(searchValue, contactContainer) {
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    contactContainer.innerHTML = '';

    filteredContacts.forEach(contact => {
        contactContainer.innerHTML += generateAssignedContactsHTML(contact.initials, contact.name, contact.id, contact.profileColor);
        updateCheckboxState(contact.id);
    });
}

function filterContacts() {
    const elements = getElements();
    if (!elements) return;

    const searchValue = elements.searchInput.value.toLowerCase();
    displayFilteredContacts(searchValue, elements.contactContainer);
}

/**
 * This is a function to toggle the checkbox of a contact. 
 * 
 * @param {string} contactId - ID of the contact
 */
function toggleCheckbox(contactId) {
    const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;
    const selectedContact = contacts.find(contact => contact.id === contactId);
    const contactLayout = checkbox.closest('.at-contact-layout');
    if (checkbox.checked) {
        addContactToTask(selectedContact.initials, contactId, selectedContact.profileColor);
        if (contactLayout) {
            contactLayout.style.backgroundColor = '#2a3647e0';
            contactLayout.style.color = 'white'
        }
    } else {
        removeContactFromTask(contactId);
        if (contactLayout) {
            contactLayout.style.backgroundColor = 'white';
            contactLayout.style.color = 'black'
        }
    }
}

function toggleContactListDisplay(selectItems) {
    selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
}

function toggleContactListIcons(selectItems) {
    const openIcon = document.getElementById('open-contact-list');
    const closeIcon = document.getElementById('close-contact-list');

    if (selectItems.style.display === 'block') {
        openIcon.classList.add('d-none');
        closeIcon.classList.remove('d-none');
    } else {
        openIcon.classList.remove('d-none');
        closeIcon.classList.add('d-none');
    }
}

function showContactList(selectSelected, selectItems, customSelects) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation();
        customSelects.forEach(function (s) {
            s.querySelector('.select-items').style.display = 'none';
        });

        toggleContactListDisplay(selectItems);
        toggleContactListIcons(selectItems);
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.custom-select') && !event.target.closest('.select-items')) {
            selectItems.style.display = 'none';
            toggleContactListIcons(selectItems);
        }
    });
}

/**
 * This function sets the backgroundcolor of the priority of the task.
 * 
 * @param {string} prio - priority of the task
 */
function setBackgroundColorPrio(prio) {
    let prioStatus = document.getElementById(prio);
    let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
    let prioImgActive = document.getElementById(`${prio}-img-active`);
    resetOtherPriorities(prio);

    if (prioStatus.classList.contains(`at-bg-${prio}`)) {
        removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = '';
    } else {
        addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = prio;
    }
}

/**
 * This function adds the backgroundcolor to the task. 
 * 
 * @param {string} prio - priority of the task.
 * @param {string} prioStatus - status of the task
 * @param {string} prioImgDeactive - deactivated status
 * @param {string} prioImgActive - activated status
 */
function addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.add(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'none';
    prioImgActive.style.display = 'block';
}

/**
 * This function removes the backgroundcolor to the task. 
 * 
 * @param {string} prio - priority of the task.
 * @param {string} prioStatus - status of the task
 * @param {string} prioImgDeactive - deactivated status
 * @param {string} prioImgActive - activated status
 */
function removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.remove(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'block';
    prioImgActive.style.display = 'none';
}

/**
 * This function resets the not choosen priorites. 
 * 
 * @param {string} selectedPrio - the seleceted priority of a task
 */
function resetOtherPriorities(selectedPrio) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(prio => {
        if (prio !== selectedPrio) {
            let prioStatus = document.getElementById(prio);
            let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
            let prioImgActive = document.getElementById(`${prio}-img-active`);
            removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        }
    });
}

/**
 * This function checks the status of all required input fields.
 * 
 */
function checkRequiredInput() {
    let isTitleValid = checkIfTitleEmpty();
    let isDateValid = checkIfDateEmpty();
    let isCategoryValid = checkIfCategoryEmpty();

    return isTitleValid && isDateValid && isCategoryValid;
}

function checkIfTitleEmpty() {
    let title = document.getElementById('task-title');
    if (title.value === '') {
        document.getElementById('at-alert-title').classList.remove('d-none');
        title.style.borderColor = '#FF8190';
        return false;
    }
    else {
        document.getElementById('at-alert-title').classList.add('d-none');
        title.style.borderColor = '';
        return true;
    }
}

/**
 * This function checks the status of the date field.
 * 
 */
function checkIfDateEmpty() {
    let date = document.getElementById('task-due-date');

    if (date.value === '') {
        document.getElementById('at-alert-due-date').classList.remove('d-none');
        date.style.borderColor = '#FF8190';
        return false;
    }
    else {
        document.getElementById('at-alert-due-date').classList.add('d-none');
        date.style.borderColor = '';
        return true;
    }
}

/**
 * This function checks the status of the category dropdown. 
 *
 */
function checkIfCategoryEmpty() {
    let category = document.getElementById('category-input');
    if (categoryChoosedIndex === 'false') {
        document.getElementById('at-alert-category').classList.remove('d-none');
        category.style.borderColor = '#FF8190';
        return false;
    }
    else {
        document.getElementById('at-alert-category').classList.add('d-none');
        category.style.borderColor = '';
        return true;

    }
}

/**
 * This function enable the subcategory section. 
 * 
 */
function activateSubcategory() {
    let inputField = document.getElementById('add-subcategory');
    if (document.getElementById('at-subcategory-clear').classList.contains('d-none')) {
        document.getElementById('at-subcategory-clear').classList.remove('d-none');
        document.getElementById('at-subcategory-border').classList.remove('d-none');
        document.getElementById('at-subcategory-confirm').classList.remove('d-none');
        document.getElementById('at-subcategory-open').classList.add('d-none');
    }
    window.addEventListener('click', function (event) {
        if (!inputField.contains(event.target)) {
            document.getElementById('at-subcategory-clear').classList.add('d-none');
            document.getElementById('at-subcategory-border').classList.add('d-none');
            document.getElementById('at-subcategory-confirm').classList.add('d-none');
            document.getElementById('at-subcategory-open').classList.remove('d-none');
        }
    });
}

/**
 * This function clears the input field at the subcategory section. 
 * @param {*} event - 
 */
function clearInputSubcategory(event) {
    let inputField = document.getElementById('add-subcategory');
    event.stopPropagation();
    inputField.value = '';
}

/**
 * This functions clears the task formular.
 * 
 */
function clearTask() {
    let title = document.getElementById('task-title');
    let description = document.getElementById('at-description');
    let date = document.getElementById('task-due-date');

    title.value = '';
    description.value = '';
    choosedContacts = [];
    date.value = '';
    taskPrio = '';
    categoryChoosed = '';
    subcategoriesChoosed = [];
    renderAssignedToContacts();
    showChoosedContacts();
    showAvailableContacts();
    clearCategoryDropdown();
    renderSubcategory();
    resetOtherPriorities('reset');
}

/**
 * This function forwared the user to the board html after the creation of a task. 
 * 
 */
function goToBoard() {
    let bgAddedNote = document.getElementById('bg-task-added-note');
    bgAddedNote.style.zIndex = 100;
    let addedNote = document.getElementById('task-added-note');
    addedNote.classList.add('confirmation-task-creation-shown');
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2000);
}

/**
 * This function setup the contact search placeholder.
 * 
 */

function setupContactSearchPlaceholder() {
    const searchInput = document.getElementById('contact-search');
    const originalPlaceholder = document.getElementById('original-placeholder');

    if (!searchInput || !originalPlaceholder) {
        console.error('Elemente "contact-search" oder "original-placeholder" wurden nicht gefunden.');
        return;
    }

    searchInput.addEventListener('focus', function () {
        originalPlaceholder.style.display = 'none';
    });

    searchInput.addEventListener('blur', function () {
        if (this.value === '') {
            originalPlaceholder.style.display = 'block';
        }
    });
}






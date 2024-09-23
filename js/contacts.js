/**
 * Array of beautiful colors used for profile backgrounds.
 * @type {string[]}
 */
let beautifulColors = [
    'rgb(255, 46, 46)', 'rgb(255, 161, 46)', 'rgb(255, 238, 46)', 'rgb(51, 224, 42)', 'rgb(42, 203, 224)',
    'rgb(42, 115, 224)', 'rgb(139, 42, 224)', 'rgb(218, 42, 224)', 'rgb(232, 58, 133)', 'rgb(232, 58, 58)',
];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/**
 * Initializes the contact management system.
 * Includes HTML, shows initials, loads contacts, and renders them.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function contactInit() {
    await includeHTML();
    showInitials();
    await loadDataContacts();
    renderContacts();
}

/**
 * Renders the contact list by calling createContactList.
 * @function
 * @returns {void}
 */
function renderContacts() {
    createContactList();
}

/**
 * Adds a blue border to the name input field.
 * @function
 * @returns {void}
 */
function addBlueBorderForNameInput() {
    let inputBox = document.getElementById('nameInput');
    inputBox.classList.add('blueBorder');
}

/**
 * Removes the blue border from the name input field.
 * @function
 * @returns {void}
 */
function removeBlueBorderForNameInput() {
    let inputBox = document.getElementById('nameInput');
    inputBox.classList.remove('blueBorder');
}

/**
 * Adds a blue border to the email input field.
 * @function
 * @returns {void}
 */
function addBlueBorderForEmailInput() {
    let inputBox = document.getElementById('emailInput');
    inputBox.classList.add('blueBorder');
}

/**
 * Removes the blue border from the email input field.
 * @function
 * @returns {void}
 */
function removeBlueBorderForEmailInput() {
    let inputBox = document.getElementById('emailInput');
    inputBox.classList.remove('blueBorder');
}

/**
 * Adds a blue border to the phone input field.
 * @function
 * @returns {void}
 */
function addBlueBorderForForPhoneInput() {
    let inputBox = document.getElementById('phoneInput');
    inputBox.classList.add('blueBorder');
}

/**
 * Removes the blue border from the phone input field.
 * @function
 * @returns {void}
 */
function removeBlueBorderForForPhoneInput() {
    let inputBox = document.getElementById('phoneInput');
    inputBox.classList.remove('blueBorder');
}

/**
 * Creates a list of contacts and renders them in the DOM.
 * @function
 * @param {number|null} [newContactIndex=null] - Index of the new contact to mark as active.
 * @returns {void}
 */
function createContactList(newContactIndex = null) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    const seenContacts = new Set();
    const seenLetters = new Set();

    const sortedContacts = sortContactsByInitial(contacts);

    for (const contact of sortedContacts) {
        const firstLetter = getFirstLetter(contact.initials);

        if (!seenLetters.has(firstLetter)) {
            addLetterHeading(contactList, firstLetter, seenLetters);
        }

        if (shouldAddContact(contact, firstLetter, seenContacts)) {
            const originalIndex = contacts.indexOf(contact);
            addContactToList(contactList, contact, originalIndex, newContactIndex);
            seenContacts.add(contact.name);
        }
    }
}

/**
 * Sorts an array of contacts by their initials.
 * @function
 * @param {Object[]} contacts - An array of contact objects.
 * @returns {Object[]} - A new array of sorted contacts.
 */
function sortContactsByInitial(contacts) {
    return contacts.slice().sort((a, b) => {
        const aInitial = getFirstLetter(a.initials);
        const bInitial = getFirstLetter(b.initials);
        return aInitial.localeCompare(bInitial);
    });
}

/**
 * Gets the first letter of a given set of initials.
 * @function
 * @param {string} initials - The initials of a contact.
 * @returns {string} - The first letter of the initials.
 */
function getFirstLetter(initials) {
    return initials.charAt(0).toUpperCase();
}

/**
 * Determines whether a contact should be added to the list.
 * @function
 * @param {Object} contact - The contact object.
 * @param {string} letter - The current letter being processed.
 * @param {Set} seenContacts - A set of contacts already added to the list.
 * @returns {boolean} - True if the contact should be added, false otherwise.
 */
function shouldAddContact(contact, letter, seenContacts) {
    const firstLetter = getFirstLetter(contact.initials);
    return firstLetter === letter && !seenContacts.has(contact.name);
}

/**
 * Adds a letter heading to the contact list.
 * @function
 * @param {HTMLElement} contactList - The contact list element.
 * @param {string} letter - The letter for the heading.
 * @param {Set} seenLetters - A set of letters already added as headings.
 * @returns {void}
 */
function addLetterHeading(contactList, letter, seenLetters) {
    if (seenLetters.has(letter)) return;
    const letterHeading = document.createElement('div');
    letterHeading.textContent = letter;
    letterHeading.classList.add('letter-heading');
    contactList.appendChild(letterHeading);
    seenLetters.add(letter);
}

/**
 * Adds a contact to the contact list.
 * @function
 * @param {HTMLElement} contactList - The contact list element.
 * @param {Object} contact - The contact object.
 * @param {number} originalIndex - The original index of the contact in the contacts array.
 * @param {number|null} newContactIndex - The index of the new contact to mark as active.
 * @returns {void}
 */
function addContactToList(contactList, contact, originalIndex, newContactIndex) {
    const contactItem = document.createElement('div');
    contactItem.classList.add('contact');
    if (originalIndex === newContactIndex) {
        contactItem.classList.add('active');
    }

    const profilePicture = createProfilePicture(contact);
    contactItem.appendChild(profilePicture);

    const contactDetails = createContactDetails(contact);
    contactItem.appendChild(contactDetails);

    contactList.appendChild(contactItem);
    addContactClickHandler(contactItem, originalIndex);
}

/**
 * Creates a initials on background for a contact.
 * @function
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} - The profile picture element.
 */
function createProfilePicture(contact) {
    const profilePicture = document.createElement('div');
    profilePicture.classList.add('profile-picture');
    profilePicture.style.backgroundColor = contact.profileColor;
    profilePicture.textContent = contact.initials;
    return profilePicture;
}

/**
 * Creates a contact details element for a contact.
 * @function
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} - The contact details element.
 */
function createContactDetails(contact) {
    const contactDetails = document.createElement('div');
    contactDetails.classList.add('oneContact');
    contactDetails.innerHTML = `
        <h2>${contact.name}</h2>
        <p class="blueColor">${contact.mail}</p>
    `;
    return contactDetails;
}

/**
 * Adds a click handler to a contact item.
 * @function
 * @param {HTMLElement} contactItem - The contact item element.
 * @param {number} originalIndex - The original index of the contact in the contacts array.
 * @returns {void}
 */

function addContactClickHandler(contactItem, originalIndex) {
    contactItem.onclick = function () {
        const allContacts = document.querySelectorAll('.contact');
        allContacts.forEach(c => c.classList.remove('active'));
        contactItem.classList.add('active');
        contactClickHandler(originalIndex);
    };
}

/**
 * Extracts initials from a given name.
 * @function
 * @param {string} name - Full name of the contact.
 * @returns {string} - Initials extracted from the name.
 */
function extractInitials(name) {
    const names = name.split(' ');
    let initial = '';
    for (let i = 0; i < names.length; i++) {
        initial += names[i].charAt(0).toUpperCase();
    }
    return initial;
}

/**
 * Validates and adds a new contact to the list.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function getNewContact() {
    let name = document.getElementById('fullName');
    let email = document.getElementById('emailAdress');
    let phone = document.getElementById('phoneNumber');
    let alertMessage = document.getElementById('addNewContactAlert');
    
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^\d{11,}$/; // Regex to check for at least 11 digits

    // Split name by spaces and check if there are at least two words
    let nameParts = name.value.trim().split(' ');

    if (name.value === '' || email.value === '' || phone.value === '') {
        alertMessage.innerHTML = '<p>The fields must be filled.</p>';
    } else if (nameParts.length < 2) {
        alertMessage.innerHTML = '<p>Please enter both a first and last name.</p>';
    } else if (!emailPattern.test(email.value)) {
        alertMessage.innerHTML = '<p>Please enter a valid email address.</p>';
    } else if (!phonePattern.test(phone.value)) {
        alertMessage.innerHTML = '<p style="color: red;">Phone number must be at least 11 digits long.</p>';
    } else {
        const colorIndx = Math.floor(Math.random() * beautifulColors.length);
        const color = beautifulColors[colorIndx];
        const initials = extractInitials(name.value);
        const newContact = {
            mail: email.value,
            name: name.value,
            initials: initials,
            phone: phone.value,
            profileColor: color,
        };
        await postContact("/contacts", newContact);
        await loadDataContacts();
        const newContactIndex = contacts.length - 1;
        createContactList(newContactIndex);
        contactClickHandler(newContactIndex);

        name.value = '';
        email.value = '';
        phone.value = '';
        alertMessage.innerHTML = ''; 

        cancelAddContact();
        slideSuccessfullyContact();
    }
}



/**
 * Handles click events on a contact to show their details.
 * @function
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {void}
 */
function contactClickHandler(i) {
    let contact = contacts[i];
    if (window.innerWidth < 1300) {
        editContactResponsive(contact, i);
    } else {
        let contactSection = document.getElementById('viewContact');
        contactSection.innerHTML = getContactViewTemplate(contact, i);
    }
}

/**
 * Opens the contact editing interface in a responsive layout.
 * @function
 * @param {Object} contact - Contact object.
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {void}
 */
function editContactResponsive(contact, i) {
    document.getElementById('contactListContent').classList.add('d-none');
    document.getElementById('contactContent').classList.remove('d-noneResp');
    document.getElementById('addContactResp').classList.add('d-noneResp');
    
    let contactSection = document.getElementById('viewContact');
    contactSection.innerHTML = getResponsiveContactTemplate(contact, i);
}

/**
 * Shows the editing div with a sliding animation.
 * @function
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {void}
 */
function showEditDiv(i) {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '6px';
    }, 10);
    document.addEventListener('click', outsideClickListener);
    function outsideClickListener(event) {
        // Check if the click is outside of the editDivResp
        if (!editDivResp.contains(event.target)) {
            closeEditDiv(); // Call the function to close the div
            removeOutsideClickListener(); // Remove the event listener after the div is closed
        }
    }

function removeOutsideClickListener() {
        // Remove the event listener
        document.removeEventListener('click', outsideClickListener);
    }
}

/**
 * Closes the editing div with a sliding animation.
 * @function
 * @returns {void}
 */
 function closeEditDiv() {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '-200px';
    }, 10);
} 

/**
 * Closes the responsive contact editing interface.
 * @function
 * @returns {void}
 */
function closeEditResponsive() {
     // Entferne die 'active' Klasse von allen Kontakten
     const allContacts = document.querySelectorAll('.contact');
     allContacts.forEach(c => c.classList.remove('active'));
    document.getElementById('contactListContent').classList.remove('d-none');
    document.getElementById('contactContent').classList.add('d-noneResp');
    // document.getElementById('editContactThirdSection').classList.remove('d-noneResp');
    document.getElementById('addContactResp').classList.remove('d-noneResp');
}

/**
 * Shows a success message when a contact is successfully added.
 * @function
 * @returns {void}
 */
function slideSuccessfullyContact() {
    let container = document.getElementById('successfullyContainer');
    let successfully = document.getElementById('successfully');
    container.style.display = 'flex';
    successfully.classList.add('slide-in-bottom');
    setTimeout(() => {
        successfully.classList.remove('slide-in-bottom');
        container.style.display = 'none';
    }, 1000);
}

/**
 * Opens the contact editing interface.
 * @async
 * @function
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {Promise<void>}
 */
async function showEditContact(i) {
    let contact = contacts[i];
    let name = contact.name;
    let mail = contact.mail;
    let phone = contact.phone;
    isItYou = name.includes('(You)');
    let displayName = isItYou ? name.substr(0, name.length - 12) : name;

    const color = contact['profileColor'];

    document.getElementById('editContactSecondSection').innerHTML = '';
    document.getElementById('blurBackgroundEdit').classList.remove('d-none');
    editContact.style.display = "flex";
    setTimeout(() => {
        editContact.style.bottom = "0";
        editContact.style.right = "0";
    }, 10);
    document.getElementById('editContactSecondSection').innerHTML = editContactHTML(i);
    document.getElementById('editName').value = displayName;
    document.getElementById('editEmail').value = mail;
    document.getElementById('editPhone').value = phone;
    document.getElementById('initialsEditContact').style.backgroundColor = color;
    document.getElementById('initialsText').innerHTML = contact.initials;
}

/**
 * Generates the HTML for editing a contact.
 * @function
 * @param {number} i - The index of the contact to edit.
 * @returns {string} - The HTML template for editing the contact.
 */
function editContactHTML(i) {
    let contact = contacts[i];
    return getEditContactTemplate(contact, i);
}

/**
 * Edits a contact and updates the contact list.
 * @async
 * @function
 * @param {number} i - The index of the contact to edit.
 * @returns {Promise<void>}
 */
async function editContactToArray(i) {
    let contact = contacts[i];
    let name = document.getElementById('editName');
    let email = document.getElementById('editEmail');
    let phone = document.getElementById('editPhone');
    let alertMessage = document.getElementById('addNewContactAlertedit');
    const initial = extractInitials(name.value);

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^\d{11,}$/; // Regex to check for at least 11 digits

    // Split name by spaces and check if there are at least two words
    let nameParts = name.value.trim().split(' ');

    if (name.value === '') {
        alertMessage.innerHTML = '<p style="color: red;">Please enter both a first and last name.</p>';
    } else if (nameParts.length < 2) {
        alertMessage.innerHTML = '<p style="color: red;">Please enter both a first and last name.</p>';
    } else if (!emailPattern.test(email.value)) {
        alertMessage.innerHTML = '<p style="color: red;">Please enter a valid email address.</p>';
    } else if (!phonePattern.test(phone.value)) {
        alertMessage.innerHTML = '<p style="color: red;">Phone number must be at least 11 digits long.</p>';
    } else {
        let myName = isItYou ? name.value + ' (You)' : name.value;

        const updatedContact = {
            "name": myName,
            "mail": email.value,
            "phone": phone.value,
            "profileColor": contact.profileColor,
            "initials": initial
        };

    await postContact("/contacts", newContact);
    await loadDataContacts();
    contactClickHandler(contacts.length - 1);
    cancelEditContact();
    createContactList();
}
}

// Öffnet die Box 'Add new Contact'
function showAddContact() {
    document.getElementById('addNewContactAlert').innerHTML = '';
    document.getElementById('blurBackground').classList.remove('d-none');
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.display = "flex"; // Ensure it's visible before starting the animation
    setTimeout(() => {
        addNewContact.style.right = "0";  // Slide into view from right
        addNewContact.style.bottom = "0"; // Slide up into view from bottom
    }, 10);
}



/**
 * Cancels the "Add Contact" modal and clears the input fields.
 * @function
 * @returns {void}
 */

function cancelAddContact() {
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.right = "-6000px";  // Slide out to the right
    addNewContact.style.bottom = "-6000px"; // Slide down off screen
    setTimeout(() => {
        addNewContact.style.display = "none"; // Hide after sliding completes
        document.getElementById('blurBackground').classList.add('d-none');
    }, 800); // Delay matches the transition duration (0.5s)
}



/**
 * Cancels the "Edit Contact" modal and closes the edit div.
 * @function
 * @returns {void}
 */
function cancelEditContact() {
    closeEditContact(); // Trigger the sliding animation
    setTimeout(() => {
        let editContact = document.getElementById('editContact');
        editContact.style.display = "none"; // Hide after sliding completes
        document.getElementById('blurBackgroundEdit').classList.add('d-none');
    }, 800); // Delay to match transition duration
}


function closeEditContact() {
    let editContact = document.getElementById('editContact');
    editContact.style.right = "-6000px"; // Start sliding animation
    editContact.style.bottom = "-6000px"; // Slide down
}
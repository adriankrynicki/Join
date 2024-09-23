function generateSubcategoryHTML(subcategory, index) {
    return /*html*/ `
        <div class="choosed-subcategorie-container">
            <input class="choosed-subcategory-input" value="${subcategory}" id="choosed-subcategory-${index}">
            <div class="choosed-subcategorie-btn-container">
                <img onclick="focusInput('choosed-subcategory-${index}')" class="at-choosed-subcategory-edit" src="assets/img/editDark.png" id="at-choosed-subcategory-edit-${index}">
                <div class="small-border-container"></div>
                <img onclick="removeSubcategory(${index})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-${index}">
            </div>
            <div class="choosed-subcategorie-btn-container-active-field">
                <img onclick="removeSubcategory(${index})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-active-${index}">
                <div class="small-border-container-gray"></div>
                <img class="at-choosed-subcategory-check" src="assets/img/checkOkDarrk.png" id="at-choosed-subcategory-check-active-${index}">
            </div>
        </div>`;
}

function renderSubcategory() {
    const content = document.getElementById('added-subcategories');
    content.innerHTML = '';

    const subcategory = document.getElementById('add-subcategory');
    const newCategory = subcategory.value.trim();

    if (newCategory !== '') {
        subcategoriesChoosed.push(newCategory);
        subtaskCompleted.push('false');
    }

    subcategoriesChoosed.forEach((subcategory, index) => {
        content.innerHTML += generateSubcategoryHTML(subcategory, index);
    });

    subcategory.value = '';
}

/**
 * This function removes all subcategories. 
 * 
 */
function removeAllSubcategory() {
    subcategoriesChoosed.splice(subcategoriesChoosed.length);
    renderSubcategory();
}

/**
 * This function activate the current input field.
 * 
 * @param {string} inputId - ID of the input field / subcategorie
 */
function focusInput(inputId) {
    document.getElementById(inputId).focus();
}

/**
 * This function remove the specific subcategorie.
 * 
 * @param {string} i - ID of the subcategorie.
 */
function removeSubcategory(i) {
    subcategoriesChoosed.splice(i, 1);
    subtaskCompleted.splice(i, 1);
    renderSubcategory();
}
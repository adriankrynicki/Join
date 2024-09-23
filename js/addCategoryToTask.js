function showCategoryList() {
    const customSelects = document.querySelectorAll('.custom-category-select');
    customSelects.forEach(function (select) {
        const selectSelected = select.querySelector('.select-category-selected');
        const selectItems = select.querySelector('.select-category-items');
        const options = selectItems.querySelectorAll('.at-contact-layout');

        toggleCategoryDropdown(selectSelected, selectItems);
        handleCategorySelection(options, selectSelected, selectItems);

        window.addEventListener('click', function (e) {
            if (!select.contains(e.target)) {
                selectItems.style.display = 'none';
                toggleCategoryIcons(selectItems);
            }
        });
    });
}

/**
 * This function shows the dropdown menü of the available categories.
 * 
 * @param {string} selectSelected - div container of a 
 * @param {string} selectItems - div container of a 
 */
function showCategoryDropdown(selectSelected, selectItems) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation();
        if (selectItems.style.display === 'block') {
            selectItems.style.display = 'none';

        } else {
            selectItems.style.display = 'block';

        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.custom-category-select')) {
            selectItems.style.display = 'none';
        }
    });
}

/**
 * This function assigne a category to a task. 
 * 
 * @param {string} options - available categories
 * @param {*} selectSelected - div container of a dropdown
 * @param {*} selectItems - div container of a dropdown
 */
function chooseCategoryFromList(options, selectSelected, selectItems) {
    options.forEach(function (option) {
        option.addEventListener('click', function () {
            selectSelected.textContent = option.querySelector('.at-contact-name').textContent;
            selectItems.style.display = 'none';
            categoryChoosedIndex = 'true';
            categoryChoosed = selectSelected.textContent;
            checkIfCategoryEmpty();
        });
    });
}

/**
 * This functions clears and close the dropdown of the category menu.
 */
function clearCategoryDropdown() {
    let customSelects = document.querySelectorAll('.custom-category-select');
    customSelects.forEach(function (select) {
        let selectSelected = select.querySelector('.select-category-selected');
        let selectItems = select.querySelector('.select-category-items');
        selectSelected.textContent = 'Select task category';
        selectItems.style.display = 'none';
        categoryChoosedIndex = 'false';
        categoryChoosed = '';
        let openIcon = document.getElementById('open-category-list');
        let closeIcon = document.getElementById('close-category-list');
        if (openIcon && closeIcon) {
            openIcon.classList.remove('d-none');
            closeIcon.classList.add('d-none');
        }
    });
}

function toggleCategoryDropdown(selectSelected, selectItems) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation();
        selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
        toggleCategoryIcons(selectItems);
    });
}

function handleCategorySelection(options, selectSelected, selectItems) {
    options.forEach(option => {
        option.addEventListener('click', function () {
            selectSelected.innerHTML = this.innerHTML;
            selectItems.style.display = 'none';
            toggleCategoryIcons(selectItems);
        });
    });
}

function toggleCategoryIcons(selectItems) {
    const openIcon = document.getElementById('open-category-list');
    const closeIcon = document.getElementById('close-category-list');

    if (openIcon && closeIcon) {
        if (selectItems.style.display === 'block') {
            openIcon.classList.add('d-none');
            closeIcon.classList.remove('d-none');
        } else {
            openIcon.classList.remove('d-none');
            closeIcon.classList.add('d-none');
        }
    }
}
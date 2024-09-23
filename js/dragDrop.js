/**
 * @type {string|null} - The ID of the currently dragged element.
 */
let currentDraggedElement = null;

/**
 * @type {number|null} - The initial X coordinate when dragging starts.
 */
let initialX = null;

/**
 * @type {number|null} - The initial Y coordinate when dragging starts.
 */
let initialY = null;

/**
 * @type {boolean} - Flag to indicate if an element is currently being dragged.
 */
let isDragging = false;

/**
 * @type {HTMLElement|null} - The visual clone of the dragged element.
 */
let dragClone = null;

/**
 * @type {HTMLElement|null} - The current highlighted drop zone.
 */
let highlightedDropZone = null;

/**
 * Initializes event listeners for scrolling containers once the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainers = document.querySelectorAll('.taskContent');
    const scrollSpeed = 5;
    const scrollMargin = 0.3;
    scrollContainers.forEach(container => {
        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            const containerWidth = rect.width;
            const containerLeft = rect.left;
            const mouseX = event.clientX - containerLeft;
            const leftMargin = containerWidth * scrollMargin;
            const rightMargin = containerWidth * (1 - scrollMargin);
            if (mouseX < leftMargin) {
                container.scrollLeft -= scrollSpeed * (leftMargin - mouseX) / leftMargin;
            } else if (mouseX > rightMargin) {
                container.scrollLeft += scrollSpeed * (mouseX - rightMargin) / (containerWidth - rightMargin);
            }
        });
    });
});

/**
 * Stops the propagation of the event to parent elements.
 * @param {Event} event - The event to stop propagation for.
 */
function stopPropagation(event) {
    event.stopPropagation();
}
/**
 * Sets the ID of the task that is currently being dragged.
 * @param {string} taskId - The ID of the task being dragged.
 */
function startDragging(taskId) {
    currentDraggedElement = taskId;
}
/**
 * Allows dropping by preventing the default behavior of the event.
 * Adds highlight to the drop zone.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
    let dropZone = event.target.closest('.taskContent');
    if (dropZone && highlightedDropZone !== dropZone) {
        if (highlightedDropZone) {
            highlightedDropZone.classList.remove('highlight');
        }
        dropZone.classList.add('highlight');
        highlightedDropZone = dropZone;
    }
}

/**
 * Handles the drop event by appending the dragged task to the drop zone and updating its status.
 * Removes highlight from the drop zone.
 * @async
 * @param {DragEvent} event - The drag event.
 */
async function drop(event) {
    event.preventDefault(); // Prevent default drop behavior
    let dropZone = event.target.closest('.taskContent'); // Identify the drop zone
    if (!dropZone) return;
    if (highlightedDropZone) {
        highlightedDropZone.classList.remove('highlight');
        highlightedDropZone = null;
    }
    let taskElement = document.querySelector(`[data-id="${currentDraggedElement}"]`);
    if (!taskElement) {
        console.error('Task element not found with id:', currentDraggedElement);
        return;
    }
    dropZone.appendChild(taskElement);
    let newStatus = dropZone.id;
    let task = tasks.find(t => t.id === currentDraggedElement);
    if (task) {
        task.status = newStatus;
        await changeTask(`/task/${currentDraggedElement}/status`, task.status);
        await loadDataTask();
        renderTasks();
    } else {
        console.error('Task data not found for id:', currentDraggedElement);
    }
}

/**
 * Handles the drop event on mobile devices by appending the dragged task to the drop zone and updating its status.
 * Removes highlight from the drop zone.
 * @async
 * @param {TouchEvent} event - The touch event.
 */
async function dropMobile(event) {
    let touch = event.changedTouches[0];
    let dropZone = document.elementFromPoint(touch.clientX, touch.clientY).closest('.taskContent');
    if (!dropZone) {
        console.error('Drop zone not found');
        highlightedDropZone.classList.remove('highlight');
        highlightedDropZone = null;
        return;
    }
    if (highlightedDropZone) {
        highlightedDropZone.classList.remove('highlight');
        highlightedDropZone = null;
    }
    let taskElement = document.querySelector(`[data-id="${currentDraggedElement}"]`);
    if (!taskElement) {
        console.error('Task element not found with id:', currentDraggedElement);
        return;
    }
    dropZone.appendChild(taskElement);
    let newStatus = dropZone.id;
    let task = tasks.find(t => t.id === currentDraggedElement);
    if (task) {
        task.status = newStatus;
        await changeTask(`/task/${currentDraggedElement}/status`, task.status);
        await loadDataTask();
        renderTasks();
    } else {
        console.error('Task data not found for id:', currentDraggedElement);
    }
}

/**
 * Handles the start of a touch event by setting the dragged element and creating a visual clone.
 * @param {TouchEvent} event - The touch event.
 */
document.addEventListener('touchstart', (event) => {
    const card = event.target.closest('.card');
    if (card) {
        currentDraggedElement = card.dataset.id;
        initialX = event.touches[0].clientX;
        initialY = event.touches[0].clientY;
        isDragging = false;
        dragClone = card.cloneNode(true);
        dragClone.style.position = 'absolute';
        dragClone.style.pointerEvents = 'none';
        document.body.appendChild(dragClone);
    }
}, { passive: true });

/**
 * Handles the movement of a touch event by updating the visual clone's position and determining if dragging is in progress.
 * Highlights the current drop zone.
 * @param {TouchEvent} event - The touch event.
 */
document.addEventListener('touchmove', (event) => {
    if (initialX === null || initialY === null) return;
    let currentX = event.touches[0].clientX;
    let currentY = event.touches[0].clientY;
    let diffX = currentX - initialX;
    let diffY = currentY - initialY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        isDragging = false;
        if (dragClone) {
            document.body.removeChild(dragClone);
            dragClone = null;
        }
        currentDraggedElement = null;
    } else {
        if (!event.cancelable) return;
        event.preventDefault();
        if (!isDragging) {
            isDragging = true;
            if (dragClone === null) {
                const card = document.querySelector(`[data-id="${currentDraggedElement}"]`);
                if (card) {
                    dragClone = card.cloneNode(true);
                    dragClone.style.position = 'absolute';
                    dragClone.style.pointerEvents = 'none';
                    document.body.appendChild(dragClone);
                }
            }
        }
        if (dragClone) {
            dragClone.style.left = `${currentX}px`;
            dragClone.style.top = `${currentY}px`;
        }
        let touch = event.touches[0];
        let dropZone = document.elementFromPoint(touch.clientX, touch.clientY).closest('.taskContent');
        if (dropZone && dropZone !== highlightedDropZone) {
            if (highlightedDropZone) {
                highlightedDropZone.classList.remove('highlight');
            }
            dropZone.classList.add('highlight');
            highlightedDropZone = dropZone;
        }
    }
}, { passive: false });

/**
 * Handles the end of a touch event by dropping the task if dragging was in progress and removing the visual clone.
 * @param {TouchEvent} event - The touch event.
 */
document.addEventListener('touchend', async (event) => {
    if (isDragging) {
        await dropMobile(event);
    }
    if (dragClone) {
        document.body.removeChild(dragClone);
        dragClone = null;
    }
    initialX = null;
    initialY = null;
    isDragging = false;
}, { passive: true });

/**
 * Removes highlight when the dragged element leaves the drop zone.
 */
document.querySelectorAll('.taskContent').forEach(zone => {
    zone.addEventListener('dragleave', () => {
        if (highlightedDropZone) {
            highlightedDropZone.classList.remove('highlight');
            highlightedDropZone = null;
        }
    });
});

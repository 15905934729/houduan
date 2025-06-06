// useex.js

const rowsPerPage = 5;
let currentPage = 1;

// DOM Elements
let tableBody; // Will be assigned in initializePagination
let prevButton;
let nextButton;
let pageInfoSpan;
let allRows = []; // To store all <tr> elements from the tbody

/**
 * Initializes pagination by getting DOM elements and rendering the first page.
 */
function initializePagination() {
    tableBody = document.getElementById('logTableBody');
    prevButton = document.getElementById('prevPageBtn');
    nextButton = document.getElementById('nextPageBtn');
    pageInfoSpan = document.getElementById('pageInfo');

    if (!tableBody || !prevButton || !nextButton || !pageInfoSpan) {
        console.error("Pagination elements not found. Ensure IDs are correct in HTML.");
        // Disable add button if table is not found, as addRow depends on it
        const addBtn = document.getElementById('addRowBtn');
        if (addBtn) addBtn.disabled = true;
        return;
    }
    
    // Attach event listeners to global functions for pagination buttons
    // (already done with onclick in HTML, but this is an alternative way if onclick was removed)
    // prevButton.addEventListener('click', prevPage);
    // nextButton.addEventListener('click', nextPage);

    renderTablePage();
}

/**
 * Renders the rows for the current page and updates pagination controls.
 */
function renderTablePage() {
    if (!tableBody || !prevButton || !nextButton || !pageInfoSpan) return;

    // Get all current rows from the live HTMLCollection in tableBody
    allRows = Array.from(tableBody.getElementsByTagName('tr'));

    const totalRows = allRows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1; // Ensure at least 1 page even if no rows

    // Ensure currentPage is within valid bounds
    if (currentPage < 1) {
        currentPage = 1;
    }
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Hide all rows first, then show only the ones for the current page
    allRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = ""; // Or "table-row" if specifically needed
        } else {
            row.style.display = "none";
        }
    });

    // Update page information
    pageInfoSpan.textContent = `第 ${currentPage} / ${totalPages} 页`;

    // Enable/disable pagination buttons
    prevButton.disabled = (currentPage === 1);
    nextButton.disabled = (currentPage === totalPages);
}

/**
 * Navigates to the next page.
 */
function nextPage() {
    // Recalculate totalPages in case rows were added/deleted by other means (though unlikely here)
    const totalRows = tableBody.getElementsByTagName('tr').length;
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

    if (currentPage < totalPages) {
        currentPage++;
        renderTablePage();
    }
}

/**
 * Navigates to the previous page.
 */
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTablePage();
    }
}


/**
 * Adds a new row to the table.
 * Prompts the user for MAC Address, Port, and Priority.
 * Auto-generates the '编号' (ID).
 */
function addRow() {
    if (!tableBody) {
        alert("表格主体未找到，无法添加行。");
        return;
    }

    // Get all current rows to determine the new ID correctly based on the total dataset size
    const currentTotalRows = tableBody.getElementsByTagName('tr').length;
    const newId = currentTotalRows + 1;

    const macInput = prompt('请输入新的 MAC 地址 (例如: AA:BB:CC:11:22:33)：');
    if (macInput === null) {
        alert("增加操作已取消。");
        return;
    }
    const portInput = prompt('请输入新的端口号 (例如: 12345)：');
    if (portInput === null) {
        alert("增加操作已取消。");
        return;
    }
    const priorityInput = prompt('请输入新的优先级 (例如: 100)：');
    if (priorityInput === null) {
        alert("增加操作已取消。");
        return;
    }

    const newRow = tableBody.insertRow(); // Appends to the end of tbody

    newRow.insertCell(0).innerHTML = newId;
    newRow.insertCell(1).innerHTML = macInput.trim() || "N/A";
    newRow.insertCell(2).innerHTML = portInput.trim() || "N/A";
    newRow.insertCell(3).innerHTML = priorityInput.trim() || "N/A";
    
    const actionsCell = newRow.insertCell(4);
    actionsCell.className = 'action-buttons';
    actionsCell.innerHTML = `
        <button onclick="editRow(this)" class="edit-btn"><i class="fas fa-edit"></i> 编辑</button>
        <button onclick="deleteRow(this)" class="delete-btn"><i class="fas fa-trash-alt"></i> 删除</button>
    `;
    
    // After adding the row, go to the page where the new row will be visible (usually the last page)
    const totalRowsAfterAdd = tableBody.getElementsByTagName('tr').length;
    currentPage = Math.ceil(totalRowsAfterAdd / rowsPerPage) || 1; 
    
    renderTablePage(); // Re-render to show the new row and update pagination
}

/**
 * Deletes the table row containing the clicked button.
 * @param {HTMLButtonElement} button - The delete button that was clicked.
 */
function deleteRow(button) {
    if (confirm("确定要删除此行数据吗？")) {
        const row = button.closest('tr');
        if (row) {
            const rowIndexInPage = Array.from(row.parentNode.children)
                                      .filter(child => child.style.display !== 'none')
                                      .indexOf(row);
            
            row.parentNode.removeChild(row);

            // After deleting, re-render.
            // If the deleted row was the last one on the current page,
            // and the current page is now empty and not page 1, go to previous page.
            const rowsOnCurrentPageAfterDeletion = Array.from(tableBody.getElementsByTagName('tr'))
                                                      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).length;
            
            const totalRowsRemaining = tableBody.getElementsByTagName('tr').length;
            const totalPages = Math.ceil(totalRowsRemaining / rowsPerPage) || 1;

            if (currentPage > totalPages) {
                currentPage = totalPages;
            }
            // If current page became empty due to deletion and it's not page 1
            if (rowsOnCurrentPageAfterDeletion === 0 && currentPage > 1 && totalRowsRemaining > 0) {
                 // This logic is a bit tricky. A simpler way is just to ensure currentPage is not > totalPages
                 // The renderTablePage already handles currentPage bounds.
            }
            
            // Optional: Re-number '编号' if strict sequential IDs are needed after deletion.
            // updateAllRowIds(); // You would need to implement this function

            renderTablePage();
        } else {
            console.error("Could not find row to delete.");
        }
    }
}

/**
 * Edits the data in the table row containing the clicked button.
 * Prompts for new MAC, Port, and Priority.
 * @param {HTMLButtonElement} button - The edit button that was clicked.
 */
function editRow(button) {
    const row = button.closest('tr');
    if (!row) {
        console.error("Could not find row to edit.");
        return;
    }

    const macCell = row.cells[1];
    const portCell = row.cells[2];
    const priorityCell = row.cells[3];

    const currentMac = macCell.innerHTML;
    const currentPort = portCell.innerHTML;
    const currentPriority = priorityCell.innerHTML;

    const newMac = prompt('请编辑 MAC 地址：', currentMac);
    if (newMac === null) {
        alert("编辑操作已取消。");
        return;
    }
    const newPort = prompt('请编辑端口号：', currentPort);
    if (newPort === null) {
        alert("编辑操作已取消。");
        return;
    }
    const newPriority = prompt('请编辑类型：', currentPriority);
    if (newPriority === null) {
        alert("编辑操作已取消。");
        return;
    }

    macCell.innerHTML = newMac.trim() || "N/A";
    portCell.innerHTML = newPort.trim() || "N/A";
    priorityCell.innerHTML = newPriority.trim() || "N/A";

    alert("数据已更新！");
    // No need to call renderTablePage() here as the row content is directly modified
    // and its visibility status doesn't change due to an edit.
}

/**
 * Optional: Function to update all '编号' (ID) cells if strict sequential numbering is needed after add/delete.
 * This function iterates through ALL rows in the tbody and updates their first cell.
 */
function updateAllRowIds() {
    if (!tableBody) return;
    const allCurrentRows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < allCurrentRows.length; i++) {
        if (allCurrentRows[i].cells.length > 0) {
            allCurrentRows[i].cells[0].innerHTML = i + 1;
        }
    }
}


// Wait for the DOM to be fully loaded before initializing pagination
document.addEventListener('DOMContentLoaded', initializePagination);
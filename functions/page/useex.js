//新增数据函数
function addRow() {
    var table = document.getElementById('table').getElementsByTagName('tbody')[0]; // Get tbody to insert rows correctly
    //获取插入的位置
    var length = table.rows.length;
    //插入行节点
    var newRow = table.insertRow(length); // Inserts a row into tbody

    //插入列节点对象
    var nameCol = newRow.insertCell(0);
    var contentCol = newRow.insertCell(1);
    var locationCol = newRow.insertCell(2); // Renamed for clarity
    var patientLocationCol = newRow.insertCell(3); // Renamed for clarity
    var lineAndActionsCol = newRow.insertCell(4); // Renamed for clarity

    // 修改节点文本内容
    // No need to re-get cells like this: var nameCol=row.cells[0];
    // We already have the cell objects from insertCell()

    var nameInput = prompt('请输入姓名：');
    var contentInput = prompt('请输入手术内容：');
    var locationInput = prompt('请输入所在地：'); // Corrected prompt based on table header
    var patientLocationInput = prompt('请输入被手术所在地：'); // Corrected prompt
    var lineInput = prompt('请输入所用线路：'); // New prompt for the line

    // Check if user cancelled any prompt
    if (nameInput === null || contentInput === null || locationInput === null || patientLocationInput === null || lineInput === null) {
        alert("增加操作已取消。");
        // Clean up the potentially partially added row if we decide to remove it on cancel.
        // For simplicity, we'll leave it empty if cancelled mid-way, or you can remove newRow.
        // table.deleteRow(newRow.rowIndex -1 ); // careful with rowIndex if using tbody
        return; // Stop execution if any prompt is cancelled
    }


    nameCol.innerHTML = nameInput || "N/A";
    contentCol.innerHTML = contentInput || "N/A";
    locationCol.innerHTML = locationInput || "N/A";
    patientLocationCol.innerHTML = patientLocationInput || "N/A";
    lineAndActionsCol.innerHTML = (lineInput || "N/A") +
        ' <button onclick="editRow(this)" class="edit-btn">编辑</button>' +
        '<button onclick="deleteRow(this)" class="delete-btn">删除</button>';
    
    // Apply text alignment for new cells based on CSS
    lineAndActionsCol.style.textAlign = "center";
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    // Add a confirmation dialog
    if (confirm("确定要删除此行数据吗？")) {
        row.parentNode.removeChild(row);
    }
}

function editRow(button) {
    var row = button.parentNode.parentNode; // button's parentNode is the <td>, its parentNode is <tr>
    var lineCell = row.cells[4]; // The cell containing the line and buttons

    // The line text is the first child of the cell, which is a text node.
    // We trim it to remove any leading/trailing whitespace.
    var currentLine = lineCell.firstChild.nodeValue.trim();

    var newLineInput = prompt('请输入新的线路：', currentLine);

    if (newLineInput !== null) { // User did not press cancel
        // Reconstruct the cell content with the new line and existing buttons
        // Ensure to include spaces around the line text if needed for visual separation
        lineCell.innerHTML = newLineInput.trim() +
            ' <button onclick="editRow(this)" class="edit-btn">编辑</button>' +
            '<button onclick="deleteRow(this)" class="delete-btn">删除</button>';
    }
}
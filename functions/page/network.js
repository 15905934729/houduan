// 存储网络线路数据的数组
let networks = [
    { name: '线路1', delay: 8, bandwidth: 1000, packetLoss: 0.1, status: 'available' },
    { name: '线路2', delay: 13, bandwidth: 800, packetLoss: 0.13, status: 'available' },
    { name: '线路3', delay: 5, bandwidth: 500, packetLoss: 0.05, status: 'available' },
    { name: '线路4', delay: 17, bandwidth: 750, packetLoss: 0.1, status: 'disabled' },
    { name: '线路5', delay: 10, bandwidth: 400, packetLoss: 0.26, status: 'disabled' }
];

// 更新表格中的指标样式
function updateMetricStyle(element, value, type) {
    element.classList.remove('metric-good', 'metric-warning', 'metric-critical');
    
    switch(type) {
        case 'delay':
            if (value <= 15) element.classList.add('metric-good');
            else element.classList.add('metric-warning');
            break;
        case 'bandwidth':
            if (value >= 800) element.classList.add('metric-good');
            else if (value >= 500) element.classList.add('metric-warning');
            else element.classList.add('metric-critical');
            break;
        case 'packetLoss':
            if (value <= 0.25) element.classList.add('metric-good');
            else element.classList.add('metric-warning');
            break;
    }
}

// 当状态改变时的处理函数
function changeStatus(selectElement) {
    const row = selectElement.closest('tr');
    const networkName = row.cells[0].textContent;
    const newStatus = selectElement.value;
    
    // 更新数据
    const network = networks.find(n => n.name === networkName);
    if (network) {
        network.status = newStatus;
    }

    // 更新样式
    selectElement.className = `status-${newStatus}`;
    
    // 显示提示信息
    showNotification(`${networkName}的状态已更新为${newStatus === 'available' ? '可用' : '不可用'}`);
}

// 添加新线路
function addRow() {
    const name = prompt('请输入线路名称：');
    if (!name) {
        showNotification('请输入线路名称！', 'error');
        return;
    }

    const delay = parseFloat(prompt('请输入延迟（ms）：')) || 0;
    const bandwidth = parseFloat(prompt('请输入带宽（Mbps）：')) || 0;
    const packetLoss = parseFloat(prompt('请输入丢包率（%）：')) || 0;

    // 创建新线路数据
    const newNetwork = {
        name: name,
        delay: delay,
        bandwidth: bandwidth,
        packetLoss: packetLoss,
        status: 'available'
    };
    
    networks.push(newNetwork);
    
    // 创建新行
    const table = document.getElementById('table');
    const newRow = table.insertRow(-1);
    
    // 插入单元格并设置内容
    const cells = [
        name,
        delay,
        bandwidth,
        packetLoss,
        `<select onchange="changeStatus(this)" class="status-available">
            <option value="available" selected>可用</option>
            <option value="disabled">不可用</option>
        </select>`
    ];

    cells.forEach((content, index) => {
        const cell = newRow.insertCell(index);
        cell.innerHTML = content;
        
        // 为指标添加样式
        if (index === 1) updateMetricStyle(cell, delay, 'delay');
        if (index === 2) updateMetricStyle(cell, bandwidth, 'bandwidth');
        if (index === 3) updateMetricStyle(cell, packetLoss, 'packetLoss');
    });

    showNotification('新线路添加成功！');
}

// 显示提示信息
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-size: 14px;
        z-index: 1000;
        animation: slideIn 0.5s ease-out forwards;
    `;
    
    notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
}

// 初始化表格数据
function initializeTable() {
    const table = document.getElementById('table');
    
    networks.forEach(network => {
        const newRow = table.insertRow(-1);
        
        const cells = [
            network.name,
            network.delay,
            network.bandwidth,
            network.packetLoss,
            `<select onchange="changeStatus(this)" class="status-${network.status}">
                <option value="available" ${network.status === 'available' ? 'selected' : ''}>可用</option>
                <option value="disabled" ${network.status === 'disabled' ? 'selected' : ''}>不可用</option>
            </select>`
        ];

        cells.forEach((content, index) => {
            const cell = newRow.insertCell(index);
            cell.innerHTML = content;
            
            // 为指标添加样式
            if (index === 1) updateMetricStyle(cell, network.delay, 'delay');
            if (index === 2) updateMetricStyle(cell, network.bandwidth, 'bandwidth');
            if (index === 3) updateMetricStyle(cell, network.packetLoss, 'packetLoss');
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeTable();
}); 
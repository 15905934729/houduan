// 存储医生数据的数组
let doctors = [
    { name: '张医生', hospital: '北京协和医院', status: 'available' },
    { name: '李医生', hospital: '上海瑞金医院', status: 'disabled' },
    { name: '王医生', hospital: '广州中山医院', status: 'available' },
    { name: '陈医生', hospital: '武汉同济医院', status: 'available' },
    { name: '刘医生', hospital: '成都华西医院', status: 'disabled' }
];

// 当状态改变时的处理函数
function changeStatus(selectElement) {
    const row = selectElement.closest('tr');
    const doctorName = row.cells[0].textContent;
    const newStatus = selectElement.value;
    
    // 更新数据
    const doctor = doctors.find(d => d.name === doctorName);
    if (doctor) {
        doctor.status = newStatus;
    }

    // 更新样式
    selectElement.className = `status-${newStatus}`;
    
    // 显示提示信息
    showNotification(`${doctorName}的状态已更新为${newStatus === 'available' ? '可用' : '禁用'}`);
}

// 添加新医生
function addRow() {
    const name = prompt('请输入医生姓名：');
    const hospital = prompt('请输入所在医院：');
    
    if (!name || !hospital) {
        showNotification('请填写完整信息！', 'error');
        return;
    }

    // 创建新医生数据
    const newDoctor = {
        name: name,
        hospital: hospital,
        status: 'available'
    };
    
    doctors.push(newDoctor);
    
    // 创建新行
    const table = document.getElementById('table');
    const newRow = table.insertRow(-1);
    
    // 插入单元格
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    
    // 设置单元格内容
    cell1.textContent = name;
    cell2.textContent = hospital;
    cell3.innerHTML = `
        <select onchange="changeStatus(this)">
            <option value="available" selected>可用</option>
            <option value="disabled">禁用</option>
        </select>
    `;

    showNotification('新医生添加成功！');
}

// 显示提示信息
function showNotification(message, type = 'success') {
    // 创建提示元素
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
    
    // 设置不同类型的样式
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    }
    
    document.body.appendChild(notification);
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 3秒后移除提示
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// 页面加载完成后初始化状态样式
document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.className = `status-${select.value}`;
    });
}); 
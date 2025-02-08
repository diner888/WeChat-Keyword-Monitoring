// 初始化页面内容
document.getElementById('app').innerHTML = `
    <h1>WeChat Keyword Monitor</h1>
    <div id="status">正在连接服务器...</div>
    <div id="qrcode"></div>
    <div class="terminal">
        <h3>终端日志</h3>
        <div id="logs" class="terminal-content"></div>
    </div>
`;

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .terminal {
        margin-top: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        background: #f5f5f5;
    }
    .terminal-content {
        font-family: monospace;
        white-space: pre-wrap;
        max-height: 400px;
        overflow-y: auto;
        background: #1e1e1e;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
    }
    .log {
        margin: 2px 0;
        padding: 2px 5px;
    }
    .warning {
        color: #ffcc00;
    }
    .error {
        color: #ff4444;
    }
    .scan {
        color: #44ff44;
    }
    .group {
        color: #4444ff;
    }
`;
document.head.appendChild(style);

// 添加日志函数
function addLog(data) {
    const logs = document.getElementById('logs');
    const log = document.createElement('div');
    
    // 根据消息类型设置样式
    if (typeof data === 'string') {
        log.className = 'log';
        log.textContent = `[${new Date().toLocaleTimeString()}] ${data}`;
    } else {
        log.className = `log ${data.type}`;
        log.textContent = `[${new Date().toLocaleTimeString()}] ${data.message}`;
    }
    
    // 添加到日志区域
    logs.insertBefore(log, logs.firstChild);
    
    // 保持滚动到最新
    logs.scrollTop = 0;
}

// 显示二维码
function showQRCode(data) {
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = `
        <h3>请使用微信扫描二维码登录</h3>
        <p><a href="${data.qrcodeUrl}" target="_blank">点击查看二维码</a></p>
    `;
    addLog({ type: 'scan', message: '收到新的二维码，请扫描登录' });
}

// 连接 WebSocket
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    addLog('WebSocket连接已建立');
    document.getElementById('status').textContent = '已连接到服务器';
};

ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'scan') {
            // 显示二维码
            const qrcodeDiv = document.getElementById('qrcode');
            qrcodeDiv.innerHTML = `
                <h3>请使用微信扫描二维码登录</h3>
                <img src="${data.qrcodeUrl}" alt="WeChat QR Code" style="max-width: 300px;">
                <p><a href="${data.qrcodeUrl}" target="_blank">点击查看二维码</a></p>
            `;
            addLog({ type: 'scan', message: '收到新的二维码，请扫描登录' });
        } else if (data.type === 'log') {
            // 普通日志
            addLog(data);
        } else if (data.type === 'warning') {
            // 警告信息
            addLog(data);
        } else if (data.type === 'error') {
            // 错误信息
            addLog(data);
        }
    } catch (error) {
        addLog({ type: 'error', message: `处理消息错误: ${error.message}` });
    }
};

ws.onerror = (error) => {
    addLog({ type: 'error', message: `WebSocket错误: ${error}` });
    document.getElementById('status').textContent = 'WebSocket连接错误';
};

ws.onclose = () => {
    addLog({ type: 'warning', message: 'WebSocket连接已关闭' });
    document.getElementById('status').textContent = '连接已断开';
};

// 立即检查一次服务器状态
fetch('http://localhost:3000/api/status')
    .then(response => response.json())
    .then(data => {
        addLog(`服务器状态: ${JSON.stringify(data)}`);
        if (data.qrCode) {
            showQRCode(data.qrCode);
        }
    })
    .catch(error => addLog({ type: 'error', message: `检查服务器状态失败: ${error.message}` }));

// 添加一些错误处理
window.onerror = function(msg, url, line) {
    console.error(`错误: ${msg}\n在 ${url}:${line}`);
    return false;
};

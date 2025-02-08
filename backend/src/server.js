import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import { bot } from './bot.js';


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });


app.use(cors());
app.use(express.json());


let lastQrCode = null;


const clients = new Set();

// WebSocket 连接处理
wss.on('connection', (ws) => {
    console.log('新的WebSocket连接已建立');
    clients.add(ws);
    
    // 如果已经有二维码，立即发送给新连接的客户端
    if (lastQrCode) {
        ws.send(JSON.stringify(lastQrCode));
    }
    
    ws.on('close', () => {
        clients.delete(ws);
        console.log('WebSocket连接已关闭');
    });
});

// Bot 状态 API
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'running',
        wsClients: clients.size,
        hasQrCode: !!lastQrCode,
        qrCode: lastQrCode // 也通过 API 提供二维码
    });
});


function broadcast(message) {
    const data = typeof message === 'string' ? 
        { type: 'log', message } : 
        message;
        
    clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
}


const originalLog = console.log;
console.log = (...args) => {
    originalLog.apply(console, args);
    broadcast(args.join(' '));
};


const originalWarn = console.warn;
console.warn = (...args) => {
    originalWarn.apply(console, args);
    broadcast({ type: 'warning', message: args.join(' ') });
};

// 重写 console.error 来广播错误
const originalError = console.error;
console.error = (...args) => {
    originalError.apply(console, args);
    broadcast({ type: 'error', message: args.join(' ') });
};

// 启动 bot
bot.start().catch(console.error);


bot.on('scan', (qrcode, status) => {
    console.log('生成新的二维码:', qrcode);
    const qrcodeUrl = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
    
    // 保存最新的二维码信息
    lastQrCode = {
        type: 'scan',
        qrcodeUrl,
        status,
        rawQrcode: qrcode
    };
    
    // 广播二维码到所有连接的客户端
    clients.forEach(client => {
        if (client.readyState === 1) { // 1 表示连接打开状态
            try {
                client.send(JSON.stringify(lastQrCode));
                console.log('二维码已发送到客户端');
            } catch (error) {
                console.error('发送二维码失败:', error);
            }
        }
    });
});

bot.on('login', user => {
    // 广播登录状态
    clients.forEach(client => {
        client.send(JSON.stringify({
            type: 'login',
            user: user.name()
        }));
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

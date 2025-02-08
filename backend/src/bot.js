import { WechatyBuilder } from 'wechaty';
import notifier from 'node-notifier';

let bot = WechatyBuilder.build();
const KEYWORDS = ['出']; // 替换为你要监控的关键字
let targetContact = null;
const TARGET_NAME = 'BytePixel'; // 替换为你想要发送的目标联系人名字

bot
  .on('scan', (qrcode, status) => {
    const qrcodeUrl = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
    console.log(`Scan QR Code to login: ${status}\n${qrcodeUrl}`);
  })
  .on('login', async user => {
    try {
      console.log(`User ${user} logged in`);
      
      // 查找指定联系人
      targetContact = await bot.Contact.find({ name: TARGET_NAME });
      if (!targetContact) {
        console.error(`未找到联系人: ${TARGET_NAME}`);
      } else {
        console.log(`已找到目标联系人: ${TARGET_NAME}`);
      }
      
    } catch (error) {
      console.error('登录处理过程出错:', error);
    }
  })
  .on('message', async message => {
    try {
      if (!message) return;

      // 过滤文件消息
      const type = message.type();
      if (type === bot.Message.Type.Attachment || type === bot.Message.Type.Image || type === bot.Message.Type.Video) {
        console.log("文件消息，不进行信息提取。");
        return;
      }

      const text = message.text();
      if (!text) return;

      // 检查关键词
      for (const keyword of KEYWORDS) {
        if (text.includes(keyword)) {
          if(!textCheck(text)) continue;

          console.log(`检测到关键字: ${keyword}`);
          
          // 构建消息
          const fromContact = message.talker();
          const source = message.room() ? 
            `来源于群聊: ${await message.room().topic()}` : 
            `来源于私聊: ${fromContact ? fromContact.name() : '未知'}`;

          const finalMessage = [
            `检测到关键字: ${keyword}`,
            `${source}`,
            `发送者: ${fromContact ? fromContact.name() : '未知'}`,
            `发送时间: ${timeToString(message.date())}`,
            `消息内容:\n${text}`
          ].join('\n');

          // 发送给指定联系人
          if (targetContact) {
            try {
              await targetContact.say(finalMessage);
              console.log(`消息已发送给 ${TARGET_NAME}`);
            } catch (err) {
              console.error('发送消息失败:', err);
              
              // 如果发送失败，尝试重新获取联系人并重试
              try {
                targetContact = await bot.Contact.find({ name: TARGET_NAME });
                if (targetContact) {
                  await targetContact.say(finalMessage);
                  console.log(`重试成功：消息已发送给 ${TARGET_NAME}`);
                }
              } catch (retryErr) {
                console.error('重试发送失败:', retryErr);
              }
            }
          } else {
            console.error(`未找到目标联系人 ${TARGET_NAME}，无法发送消息`);
          }

          // 桌面通知
          notifier.notify({
            title: '关键词提醒',
            message: `检测到关键字: ${keyword}`
          });
        }
      }
    } catch (error) {
      console.error('消息处理过程出错:', error);
    }
  });

// 辅助函数
function timeToString(timeObj) {
  const year = timeObj.getFullYear();
  const month = timeObj.getMonth() + 1;
  const date = timeObj.getDate();
  const time = timeObj.toTimeString().split(" ")[0];
  return `${year}-${month}-${date} ${time}`;
}

function textCheck(text) {
  if (text.length < 20) {
    console.log('文本包含关键字，但是字数少于20，不予发送');
    return false;
  }
  if (isQuotedMessage(text)) {
    console.log('过滤掉引用的对话');
    return false;
  }
  return true;
}

function isQuotedMessage(text) {
  const quotePattern = /^「.*」\n- - - - - - - - - - - - - - -/;
  return quotePattern.test(text);
}

export { bot };

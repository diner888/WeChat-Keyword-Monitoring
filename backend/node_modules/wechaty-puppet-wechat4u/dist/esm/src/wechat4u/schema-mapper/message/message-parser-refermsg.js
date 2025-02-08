import * as PUPPET from 'wechaty-puppet';
import { AppMessageType, parseAppmsgMessagePayload } from '../../messages/message-appmsg.js';
import { WebMessageType } from '../../../web-schemas.js';
export const referMsgParser = async (_webMessageRawPayload, ret, context) => {
    if (!context.appMessagePayload || context.appMessagePayload.type !== AppMessageType.ReferMsg) {
        return ret;
    }
    const appPayload = context.appMessagePayload;
    let referMessageContent;
    const referMessagePayload = appPayload.refermsg;
    const referMessageType = parseInt(referMessagePayload.type);
    switch (referMessageType) {
        case WebMessageType.TEXT:
            referMessageContent = referMessagePayload.content;
            break;
        case WebMessageType.IMAGE:
            referMessageContent = '图片';
            break;
        case WebMessageType.VIDEO:
            referMessageContent = '视频';
            break;
        case WebMessageType.EMOTICON:
            referMessageContent = '动画表情';
            break;
        case WebMessageType.LOCATION:
            referMessageContent = '位置';
            break;
        case WebMessageType.APP: {
            const referMessageAppPayload = await parseAppmsgMessagePayload(referMessagePayload.content);
            referMessageContent = referMessageAppPayload.title;
            break;
        }
        default:
            referMessageContent = '未知消息';
            break;
    }
    ret.type = PUPPET.types.Message.Text;
    ret.text = `「${referMessagePayload.displayname}：${referMessageContent}」\n- - - - - - - - - - - - - - -\n${appPayload.title}`;
    return ret;
};
//# sourceMappingURL=message-parser-refermsg.js.map
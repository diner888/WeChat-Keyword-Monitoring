import * as PUPPET from 'wechaty-puppet';
import { log } from 'wechaty-puppet';
import { LOGPRE } from './message-parser.js';
import { WebMessageType } from '../../../web-schemas.js';
const TypeMappings = {
    [WebMessageType.TEXT]: PUPPET.types.Message.Text,
    [WebMessageType.IMAGE]: PUPPET.types.Message.Image,
    [WebMessageType.VOICE]: PUPPET.types.Message.Audio,
    [WebMessageType.EMOTICON]: PUPPET.types.Message.Emoticon,
    [WebMessageType.APP]: PUPPET.types.Message.Attachment,
    [WebMessageType.LOCATION]: PUPPET.types.Message.Location,
    [WebMessageType.MICROVIDEO]: PUPPET.types.Message.Video,
    [WebMessageType.VIDEO]: PUPPET.types.Message.Video,
    [WebMessageType.SYS]: PUPPET.types.Message.Unknown,
    [WebMessageType.SHARECARD]: PUPPET.types.Message.Contact,
    [WebMessageType.RECALLED]: PUPPET.types.Message.Recalled,
    [WebMessageType.STATUSNOTIFY]: PUPPET.types.Message.Unknown,
    [WebMessageType.SYSNOTICE]: PUPPET.types.Message.Unknown,
};
export const typeParser = async (webMessageRawPayload, ret, _context) => {
    const wechatMessageType = webMessageRawPayload.MsgType;
    let type = TypeMappings[wechatMessageType];
    if (!type) {
        log.verbose(LOGPRE, `unsupported type: ${JSON.stringify(webMessageRawPayload)}`);
        type = PUPPET.types.Message.Unknown;
    }
    ret.type = type;
    return ret;
};
//# sourceMappingURL=message-parser-type.js.map
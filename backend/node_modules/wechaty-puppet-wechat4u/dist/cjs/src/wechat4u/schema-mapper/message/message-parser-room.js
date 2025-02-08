"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomParser = void 0;
const is_type_js_1 = require("../../utils/is-type.js");
const parse_mention_id_list_js_1 = require("../../utils/parse-mention-id-list.js");
async function roomMessageSentByOthers(webMessageRawPayload, ret) {
    let roomId;
    if ((0, is_type_js_1.isRoomId)(webMessageRawPayload.FromUserName)) {
        roomId = webMessageRawPayload.FromUserName;
    }
    else if ((0, is_type_js_1.isRoomId)(webMessageRawPayload.ToUserName)) {
        roomId = webMessageRawPayload.ToUserName;
    }
    else {
        roomId = undefined;
    }
    if (roomId) {
        ret.roomId = roomId;
        /**
         * separator of talkerId and content:
         *
         * text:    "wxid_xxxx:\nnihao"
         * appmsg:  "wxid_xxxx:\n<?xml version="1.0"?><msg><appmsg appid="" sdkver="0">..."
         * pat:     "19850419xxx@chatroom:\n<sysmsg type="pat"><pat><fromusername>xxx</fromusername><chatusername>19850419xxx@chatroom</chatusername><pattedusername>wxid_xxx</pattedusername>...<template><![CDATA["${vagase}" 拍了拍我]]></template></pat></sysmsg>"
         */
        const separatorIndex = webMessageRawPayload.OriginalContent.indexOf(':<br/>');
        if (separatorIndex !== -1) {
            const takerIdPrefix = webMessageRawPayload.OriginalContent.slice(0, separatorIndex);
            ret.talkerId = takerIdPrefix;
            let text = '';
            const parts = webMessageRawPayload.Content.split(':\n');
            if (parts.length > 1) {
                text = parts[1];
            }
            else {
                text = webMessageRawPayload.Content;
            }
            ret.text = text;
        }
        else {
            /**
             * Message that can not get talkerId from payload:
             * 1. Create room with users that have deleted you: https://gist.github.com/padlocal/e95f8e05eb00556317991964eecfd150
             *
             * But talkerId is required by Wechaty, or exception will be raised:
             * https://github.com/wechaty/wechaty/blob/435cefd90baf7f2a0c801010132e74f9e0575fc2/src/user-modules/message.ts#L813
             * Solution: we set talkerId to fromusername, treating these kinds of messages are sent by self.
             */
            ret.talkerId = webMessageRawPayload.ToUserName;
        }
    }
}
async function roomMessageSentBySelf(webMessageRawPayload, ret) {
    let talkerId;
    let roomId;
    if ((0, is_type_js_1.isRoomId)(webMessageRawPayload.FromUserName)) {
        roomId = webMessageRawPayload.FromUserName;
    }
    else if ((0, is_type_js_1.isRoomId)(webMessageRawPayload.ToUserName)) {
        roomId = webMessageRawPayload.ToUserName;
    }
    else {
        roomId = undefined;
    }
    if ((0, is_type_js_1.isContactId)(webMessageRawPayload.FromUserName)) {
        talkerId = webMessageRawPayload.FromUserName;
    }
    else {
        const array = webMessageRawPayload.OriginalContent.match(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/) || [];
        talkerId = array[1];
        if (!talkerId) {
            talkerId = '';
        }
    }
    if (roomId) {
        // room message sent by self
        ret.roomId = roomId;
        ret.talkerId = talkerId;
        let text = '';
        const parts = webMessageRawPayload.Content.split(':\n');
        if (parts.length > 1) {
            text = parts[1];
        }
        else {
            text = webMessageRawPayload.Content;
        }
        ret.text = text;
    }
}
/**
 * try to parse talkerId and content for generic room messages
 * @param padLocalMessage
 * @param ret
 * @param context
 */
const roomParser = async (webMessageRawPayload, ret, context) => {
    await roomMessageSentByOthers(webMessageRawPayload, ret);
    await roomMessageSentBySelf(webMessageRawPayload, ret);
    if (ret.roomId) {
        context.isRoomMessage = true;
        const mentionIdList = await (0, parse_mention_id_list_js_1.parseMentionIdList)(context.puppet, ret.roomId, ret.text || '');
        const room = ret;
        room.mentionIdList = mentionIdList;
    }
    return ret;
};
exports.roomParser = roomParser;
//# sourceMappingURL=message-parser-room.js.map
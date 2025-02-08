"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleChatParser = void 0;
const singleChatParser = async (webMessageRawPayload, ret, context) => {
    if (!context.isRoomMessage) {
        ret.talkerId = webMessageRawPayload.FromUserName;
        ret.listenerId = webMessageRawPayload.ToUserName;
    }
    return ret;
};
exports.singleChatParser = singleChatParser;
//# sourceMappingURL=message-parser-single-chat.js.map
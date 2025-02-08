export const singleChatParser = async (webMessageRawPayload, ret, context) => {
    if (!context.isRoomMessage) {
        ret.talkerId = webMessageRawPayload.FromUserName;
        ret.listenerId = webMessageRawPayload.ToUserName;
    }
    return ret;
};
//# sourceMappingURL=message-parser-single-chat.js.map
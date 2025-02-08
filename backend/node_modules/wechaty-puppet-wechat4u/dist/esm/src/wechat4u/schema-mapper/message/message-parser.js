const messageParserList = [];
export function addMessageParser(parser) {
    messageParserList.push(parser);
}
export async function executeMessageParsers(puppet, webMessageRawPayload, ret) {
    const context = {
        isRoomMessage: false,
        puppet,
    };
    for (const parser of messageParserList) {
        ret = await parser(webMessageRawPayload, ret, context);
    }
    return ret;
}
export const LOGPRE = 'message-parser';
//# sourceMappingURL=message-parser.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webMessageToWechaty = void 0;
const PUPPET = __importStar(require("wechaty-puppet"));
const mod_js_1 = require("./message/mod.js");
const is_type_js_1 = require("../utils/is-type.js");
async function webMessageToWechaty(puppet, webMessageRawPayload) {
    let talkerId;
    let text;
    /**
     * 1. Set From Contact Id
     */
    if ((0, is_type_js_1.isContactId)(webMessageRawPayload.FromUserName)) {
        talkerId = webMessageRawPayload.FromUserName;
    }
    else {
        const array = webMessageRawPayload.OriginalContent.match(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/) || [];
        talkerId = array[1];
        if (!talkerId) {
            talkerId = undefined;
        }
    }
    /**
     *
     * 2. Set Text
     */
    if ((0, is_type_js_1.isRoomId)(webMessageRawPayload.FromUserName)) {
        const parts = webMessageRawPayload.Content.split(':\n');
        if (parts.length > 1) {
            text = parts[1];
        }
        else {
            text = webMessageRawPayload.Content;
        }
    }
    else {
        text = webMessageRawPayload.Content;
    }
    // set default value for MessagePayloadBase, other fields will be fulfilled or updated var MessageParers
    const ret = {
        id: webMessageRawPayload.MsgId,
        talkerId,
        text,
        timestamp: webMessageRawPayload.CreateTime,
        type: PUPPET.types.Message.Unknown,
    };
    await (0, mod_js_1.executeMessageParsers)(puppet, webMessageRawPayload, ret);
    // validate the return value
    if (!(ret.roomId || ret.listenerId)) {
        throw new Error('neither roomId nor listenerId');
    }
    return ret;
}
exports.webMessageToWechaty = webMessageToWechaty;
//# sourceMappingURL=message.js.map
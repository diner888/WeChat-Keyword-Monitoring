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
exports.typeParser = void 0;
const PUPPET = __importStar(require("wechaty-puppet"));
const wechaty_puppet_1 = require("wechaty-puppet");
const message_parser_js_1 = require("./message-parser.js");
const web_schemas_js_1 = require("../../../web-schemas.js");
const TypeMappings = {
    [web_schemas_js_1.WebMessageType.TEXT]: PUPPET.types.Message.Text,
    [web_schemas_js_1.WebMessageType.IMAGE]: PUPPET.types.Message.Image,
    [web_schemas_js_1.WebMessageType.VOICE]: PUPPET.types.Message.Audio,
    [web_schemas_js_1.WebMessageType.EMOTICON]: PUPPET.types.Message.Emoticon,
    [web_schemas_js_1.WebMessageType.APP]: PUPPET.types.Message.Attachment,
    [web_schemas_js_1.WebMessageType.LOCATION]: PUPPET.types.Message.Location,
    [web_schemas_js_1.WebMessageType.MICROVIDEO]: PUPPET.types.Message.Video,
    [web_schemas_js_1.WebMessageType.VIDEO]: PUPPET.types.Message.Video,
    [web_schemas_js_1.WebMessageType.SYS]: PUPPET.types.Message.Unknown,
    [web_schemas_js_1.WebMessageType.SHARECARD]: PUPPET.types.Message.Contact,
    [web_schemas_js_1.WebMessageType.RECALLED]: PUPPET.types.Message.Recalled,
    [web_schemas_js_1.WebMessageType.STATUSNOTIFY]: PUPPET.types.Message.Unknown,
    [web_schemas_js_1.WebMessageType.SYSNOTICE]: PUPPET.types.Message.Unknown,
};
const typeParser = async (webMessageRawPayload, ret, _context) => {
    const wechatMessageType = webMessageRawPayload.MsgType;
    let type = TypeMappings[wechatMessageType];
    if (!type) {
        wechaty_puppet_1.log.verbose(message_parser_js_1.LOGPRE, `unsupported type: ${JSON.stringify(webMessageRawPayload)}`);
        type = PUPPET.types.Message.Unknown;
    }
    ret.type = type;
    return ret;
};
exports.typeParser = typeParser;
//# sourceMappingURL=message-parser-type.js.map
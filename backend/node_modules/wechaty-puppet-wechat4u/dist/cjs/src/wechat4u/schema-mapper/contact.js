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
exports.wechat4uContactToWechaty = void 0;
const PUPPET = __importStar(require("wechaty-puppet"));
const xml_js_1 = require("../utils/xml.js");
const wechaty_puppet_1 = require("wechaty-puppet");
function wechat4uContactToWechaty(rawPayload) {
    wechaty_puppet_1.log.silly('PuppetWechat4u', 'contactParseRawPayload(Object.keys(payload).length=%d)', Object.keys(rawPayload).length);
    if (!Object.keys(rawPayload).length) {
        wechaty_puppet_1.log.error('PuppetWechat4u', 'contactParseRawPayload(Object.keys(payload).length=%d)', Object.keys(rawPayload).length);
        wechaty_puppet_1.log.error('PuppetWechat4u', 'contactParseRawPayload() got empty rawPayload!');
        throw new Error('empty raw payload');
        // return {
        //   gender: Gender.Unknown,
        //   type:   Contact.Type.Unknown,
        // }
    }
    // this.id = rawPayload.UserName   // MMActualSender??? MMPeerUserName???
    // `getUserContact(message.MMActualSender,message.MMPeerUserName).HeadImgUrl`
    // uin:        rawPayload.Uin,    // stable id: 4763975 || getCookie("wxuin")
    return {
        address: rawPayload.Alias,
        alias: (0, xml_js_1.plainText)(rawPayload.RemarkName),
        avatar: rawPayload.HeadImgUrl,
        city: rawPayload.City,
        friend: !!(rawPayload.ContactFlag & 1),
        gender: rawPayload.Sex,
        id: rawPayload.UserName,
        name: (0, xml_js_1.plainText)(rawPayload.NickName) || '',
        phone: [],
        province: rawPayload.Province,
        signature: rawPayload.Signature,
        star: !!rawPayload.StarFriend,
        weixin: rawPayload.Alias,
        // tslint:disable:max-line-length
        /**
         * @see 1. https://github.com/Chatie/webwx-app-tracker/blob/7c59d35c6ea0cff38426a4c5c912a086c4c512b2/formatted/webwxApp.js#L3243
         * @see 2. https://github.com/Urinx/WeixinBot/blob/master/README.md
         * @ignore
         */
        // eslint-disable-next-line sort-keys
        type: (!!rawPayload.UserName && !rawPayload.UserName.startsWith('@@') && !!(rawPayload.VerifyFlag & 8))
            ? PUPPET.types.Contact.Official
            : PUPPET.types.Contact.Individual,
        /**
         * @see 1. https://github.com/Chatie/webwx-app-tracker/blob/7c59d35c6ea0cff38426a4c5c912a086c4c512b2/formatted/webwxApp.js#L3246
         * @ignore
         */
        // special:       specialContactList.indexOf(rawPayload.UserName) > -1 || /@qqim$/.test(rawPayload.UserName),
    };
}
exports.wechat4uContactToWechaty = wechat4uContactToWechaty;
//# sourceMappingURL=contact.js.map
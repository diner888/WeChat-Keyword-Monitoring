"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechat4uRoomMemberToWechaty = exports.wechat4uRoomToWechaty = void 0;
const wechaty_puppet_1 = require("wechaty-puppet");
const xml_js_1 = require("../utils/xml.js");
function wechat4uRoomToWechaty(rawPayload) {
    wechaty_puppet_1.log.verbose('PuppetWechat4u', 'roomRawPayloadParser(%s)', rawPayload);
    const id = rawPayload.UserName;
    // const rawMemberList = rawPayload.MemberList || []
    // const memberIdList  = rawMemberList.map(rawMember => rawMember.UserName)
    // const aliasDict = {} as { [id: string]: string | undefined }
    // if (Array.isArray(rawPayload.MemberList)) {
    //   rawPayload.MemberList.forEach(rawMember => {
    //     aliasDict[rawMember.UserName] = rawMember.DisplayName
    //   })
    // }
    const memberIdList = rawPayload.MemberList
        ? rawPayload.MemberList.map(m => m.UserName)
        : [];
    const roomPayload = {
        adminIdList: [],
        avatar: rawPayload.HeadImgUrl,
        id,
        memberIdList,
        topic: (0, xml_js_1.plainText)(rawPayload.NickName) || '',
        // aliasDict,
    };
    return roomPayload;
}
exports.wechat4uRoomToWechaty = wechat4uRoomToWechaty;
function wechat4uRoomMemberToWechaty(rawPayload) {
    wechaty_puppet_1.log.verbose('PuppetWechat4u', 'roomMemberRawPayloadParser(%s)', rawPayload);
    const payload = {
        avatar: rawPayload.HeadImgUrl,
        id: rawPayload.UserName,
        name: rawPayload.NickName,
        roomAlias: rawPayload.DisplayName,
    };
    return payload;
}
exports.wechat4uRoomMemberToWechaty = wechat4uRoomMemberToWechaty;
//# sourceMappingURL=room.js.map
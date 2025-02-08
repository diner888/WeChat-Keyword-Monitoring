import { log } from 'wechaty-puppet';
import { plainText } from '../utils/xml.js';
export function wechat4uRoomToWechaty(rawPayload) {
    log.verbose('PuppetWechat4u', 'roomRawPayloadParser(%s)', rawPayload);
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
        topic: plainText(rawPayload.NickName) || '',
        // aliasDict,
    };
    return roomPayload;
}
export function wechat4uRoomMemberToWechaty(rawPayload) {
    log.verbose('PuppetWechat4u', 'roomMemberRawPayloadParser(%s)', rawPayload);
    const payload = {
        avatar: rawPayload.HeadImgUrl,
        id: rawPayload.UserName,
        name: rawPayload.NickName,
        roomAlias: rawPayload.DisplayName,
    };
    return payload;
}
//# sourceMappingURL=room.js.map
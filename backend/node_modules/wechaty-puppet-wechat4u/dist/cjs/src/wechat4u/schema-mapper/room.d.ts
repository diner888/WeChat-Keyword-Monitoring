import type { WebRoomRawPayload, WebRoomRawMember } from '../../web-schemas.js';
import type * as PUPPET from 'wechaty-puppet';
export declare function wechat4uRoomToWechaty(rawPayload: WebRoomRawPayload): PUPPET.payloads.Room;
export declare function wechat4uRoomMemberToWechaty(rawPayload: WebRoomRawMember): PUPPET.payloads.RoomMember;
//# sourceMappingURL=room.d.ts.map
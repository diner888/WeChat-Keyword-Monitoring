import * as PUPPET from 'wechaty-puppet';
import type { FileBoxInterface } from 'file-box';
import { FileBox } from 'file-box';
import { WebContactRawPayload, WebMessageRawPayload, WebRoomRawMember, WebRoomRawPayload } from './web-schemas.js';
export declare class PuppetWechat4u extends PUPPET.Puppet {
    options: PUPPET.PuppetOptions;
    static readonly VERSION: string;
    /**
     * Wecaht4u
     *
     * Code from:
     * https://github.com/nodeWechat/wechat4u/blob/46931e78bcb56899b8d2a42a37b919e7feaebbef/run-core.js
     *
     */
    private wechat4u?;
    private scanQrCode?;
    private startTime;
    private unknownContactId;
    private getContactInterval;
    private _heartBeatTimer?;
    private readonly cacheMessageRawPayload;
    constructor(options?: PUPPET.PuppetOptions);
    version(): string;
    name(): string;
    onStart(): Promise<void>;
    /**
     * At present, if a user information that does not exist is found, it will be called once.
     * If it is a group message, it will send a lot of information requests, and finally most of the interface requests will fail.
     * At present, the method of timer is used to regularly obtain user information
     * 1、A timer is started when the search request is triggered for the first time
     * 2、All requested unknown user ids will be stored in unknownContactId
     * 3、The timer will be executed once every 500ms, each time fetching 50 pieces of data in unknownContactId
     * 4、If the data of unknownContactId is empty, the timer will be cleared and wait for the next establishment
     * @private
     */
    private getContactsInfo;
    private monkeyPatch;
    private _startPuppetHeart;
    /**
     * Monkey Patch for Wechat4u
     *  - https://www.audero.it/blog/2016/12/05/monkey-patching-javascript/#what-is-monkey-patching
     *
     * What is Monkey patching?
     *  Monkey patching is a technique to add, modify, or suppress
     *  the default behavior of a piece of code at runtime
     *  without changing its original source code.
     */
    private monkeyPatchOffState;
    /**
     * @private
     * For issue https://github.com/wechaty/puppet-wechat/issues/107
     */
    private waitStable;
    private initHookEvents;
    onStop(): Promise<void>;
    ding(data: string): Promise<void>;
    /**
     *
     * ContactSelf
     *
     *
     */
    contactSelfQRCode(): Promise<string>;
    contactSelfName(name: string): Promise<void>;
    contactSelfSignature(signature: string): Promise<void>;
    /**
     *
     * Contact
     *
     */
    contactAlias(contactId: string): Promise<string>;
    contactAlias(contactId: string, alias: null | string): Promise<void>;
    contactList(): Promise<string[]>;
    contactAvatar(contactId: string): Promise<FileBoxInterface>;
    contactAvatar(contactId: string, file: FileBoxInterface): Promise<void>;
    contactRawPayload(contactId: string): Promise<WebContactRawPayload>;
    contactRawPayloadParser(rawPayload: WebContactRawPayload): Promise<PUPPET.payloads.Contact>;
    /**
     *
     * Message
     *
     */
    messageContact(messageId: string): Promise<string>;
    messageRecall(messageId: string): Promise<boolean>;
    messageImage(messageId: string, imageType: PUPPET.types.Image): Promise<FileBoxInterface>;
    messageFile(id: string): Promise<FileBoxInterface>;
    messageUrl(messageId: string): Promise<PUPPET.payloads.UrlLink>;
    messageMiniProgram(messageId: string): Promise<PUPPET.payloads.MiniProgram>;
    messageRawPayload(id: string): Promise<WebMessageRawPayload>;
    messageRawPayloadParser(rawPayload: WebMessageRawPayload): Promise<PUPPET.payloads.Message>;
    messageSendText(conversationId: string, text: string): Promise<void>;
    messageSendFile(conversationId: string, file: FileBox): Promise<void>;
    messageSendContact(conversationId: string, contactId: string): Promise<void>;
    messageSendUrl(conversationId: string, urlLinkPayload: PUPPET.payloads.UrlLink): Promise<void>;
    messageSendMiniProgram(conversationId: string, miniProgramPayload: PUPPET.payloads.MiniProgram): Promise<void>;
    messageForward(conversationid: string, messageId: string): Promise<void>;
    conversationReadMark(conversationId: string, hasRead?: boolean): Promise<void | boolean>;
    /**
     *
     * Room Invitation
     *
     */
    roomInvitationAccept(roomInvitationId: string): Promise<void>;
    roomInvitationRawPayload(roomInvitationId: string): Promise<any>;
    roomInvitationRawPayloadParser(rawPayload: any): Promise<PUPPET.payloads.RoomInvitation>;
    /**
     *
     * Room
     *
     */
    roomRawPayload(id: string): Promise<WebRoomRawPayload>;
    roomRawPayloadParser(rawPayload: WebRoomRawPayload): Promise<PUPPET.payloads.Room>;
    roomList(): Promise<string[]>;
    roomDel(roomId: string, contactId: string): Promise<void>;
    roomAvatar(roomId: string): Promise<FileBoxInterface>;
    roomAdd(roomId: string, contactId: string): Promise<void>;
    roomTopic(roomId: string): Promise<string>;
    roomTopic(roomId: string, topic: string): Promise<void>;
    roomCreate(contactIdList: string[], topic: string): Promise<string>;
    roomAnnounce(roomId: string): Promise<string>;
    roomAnnounce(roomId: string, text: string): Promise<void>;
    roomQuit(roomId: string): Promise<void>;
    roomQRCode(roomId: string): Promise<string>;
    roomMemberList(roomId: string): Promise<string[]>;
    roomMemberRawPayload(roomId: string, contactId: string): Promise<WebRoomRawMember>;
    roomMemberRawPayloadParser(rawPayload: WebRoomRawMember): Promise<PUPPET.payloads.RoomMember>;
    /**
     *
     * Friendship
     *
     */
    friendshipSearchPhone(phone: string): Promise<null | string>;
    friendshipSearchWeixin(weixin: string): Promise<null | string>;
    friendshipAdd(contactId: string, hello: string): Promise<void>;
    friendshipAccept(friendshipId: string): Promise<void>;
    friendshipRawPayload(id: string): Promise<any>;
    friendshipRawPayloadParser(rawPayload: any): Promise<PUPPET.payloads.Friendship>;
    /**
     *
     * Tag
     *
     */
    tagContactAdd(tagId: string, contactId: string): Promise<void>;
    tagContactRemove(tagId: string, contactId: string): Promise<void>;
    tagContactDelete(tagId: string): Promise<void>;
    tagContactList(contactId?: string): Promise<string[]>;
    contactCorporationRemark(..._: any[]): never;
    contactDescription(..._: any[]): never;
    contactPhone(..._: any[]): never;
    messageLocation(messageId: string): Promise<PUPPET.payloads.Location>;
    messageSendLocation(conversationId: string, locationPayload: PUPPET.payloads.Location): Promise<void | string>;
}
export default PuppetWechat4u;
//# sourceMappingURL=puppet-wechat4u.d.ts.map
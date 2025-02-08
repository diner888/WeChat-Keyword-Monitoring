import type * as PUPPET from 'wechaty-puppet';
import type { AppMessagePayload } from '../../messages/message-appmsg.js';
import type { WebMessageRawPayload } from '../../../web-schemas.js';
/**
 * Add customized message parser context info here
 */
export type MessageParserContext = {
    puppet: PUPPET.Puppet;
    isRoomMessage: boolean;
    appMessagePayload?: AppMessagePayload;
};
export type MessageParser = (webMessageRawPayload: WebMessageRawPayload, ret: PUPPET.payloads.Message, context: MessageParserContext) => Promise<PUPPET.payloads.Message>;
export declare function addMessageParser(parser: MessageParser): void;
export declare function executeMessageParsers(puppet: PUPPET.Puppet, webMessageRawPayload: WebMessageRawPayload, ret: PUPPET.payloads.Message): Promise<PUPPET.payloads.Message>;
export declare const LOGPRE = "message-parser";
//# sourceMappingURL=message-parser.d.ts.map
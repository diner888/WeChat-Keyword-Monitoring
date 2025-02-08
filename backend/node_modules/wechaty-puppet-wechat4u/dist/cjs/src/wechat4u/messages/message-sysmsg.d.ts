import type { PatMessagePayload } from './sysmsg/message-pat';
import type { SysmsgTemplateMessagePayload } from './sysmsg/message-sysmsgtemplate';
import type { TodoMessagePayload } from './sysmsg/message-todo.js';
import type { RevokeMsgMessagePayload } from './sysmsg/message-revokemsg';
import { WebMessageRawPayload } from '../../web-schemas.js';
export interface RoomTipsPayload {
    content: string;
}
type SysMsgType = 'pat' | 'sysmsgtemplate' | 'roomtoolstips' | 'revokemsg' | 'roomtips';
type SysMsgPayload = PatMessagePayload | SysmsgTemplateMessagePayload | TodoMessagePayload | RevokeMsgMessagePayload | RoomTipsPayload;
export interface SysmsgMessagePayload {
    type: SysMsgType;
    payload: SysMsgPayload;
}
export declare function parseSysmsgMessagePayload(message: WebMessageRawPayload): Promise<SysmsgMessagePayload | null>;
export declare function parseSysmsgPatMessagePayload(message: WebMessageRawPayload): Promise<PatMessagePayload | null>;
export declare function parseSysmsgSysmsgTemplateMessagePayload(message: WebMessageRawPayload): Promise<SysmsgTemplateMessagePayload | null>;
export declare function parseSysmsgTodoMessagePayload(message: WebMessageRawPayload): Promise<TodoMessagePayload | null>;
export declare function parseSysmsgRevokeMsgMessagePayload(message: WebMessageRawPayload): Promise<RevokeMsgMessagePayload | null>;
export {};
//# sourceMappingURL=message-sysmsg.d.ts.map
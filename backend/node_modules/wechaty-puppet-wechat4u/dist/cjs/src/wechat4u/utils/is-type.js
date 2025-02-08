"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContactId = exports.isRoomId = void 0;
function isRoomId(id) {
    if (!id)
        return false;
    return /^@@|@chatroom$/.test(id); // 以@@开头或者@chatroom结尾
}
exports.isRoomId = isRoomId;
function isContactId(id) {
    return !isRoomId(id);
}
exports.isContactId = isContactId;
//# sourceMappingURL=is-type.js.map
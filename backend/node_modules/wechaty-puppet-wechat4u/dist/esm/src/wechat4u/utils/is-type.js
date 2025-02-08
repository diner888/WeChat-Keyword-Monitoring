export function isRoomId(id) {
    if (!id)
        return false;
    return /^@@|@chatroom$/.test(id); // 以@@开头或者@chatroom结尾
}
export function isContactId(id) {
    return !isRoomId(id);
}
//# sourceMappingURL=is-type.js.map
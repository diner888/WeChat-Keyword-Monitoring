"use strict";
/* eslint @typescript-eslint/no-unused-vars: off */
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwUnsupportedError = void 0;
function throwUnsupportedError(..._) {
    throw new Error([
        'Wechaty Puppet Unsupported API Error.',
        ' ',
        'Learn More At https://github.com/wechaty/wechaty-puppet/wiki/Compatibility',
    ].join(''));
}
exports.throwUnsupportedError = throwUnsupportedError;
//# sourceMappingURL=throw-unsupported-error.js.map
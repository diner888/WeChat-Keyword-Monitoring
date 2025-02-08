"use strict";
// tslint:disable:no-reference
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.NAME = exports.VERSION = exports.retry = exports.qrCodeForChatie = void 0;
/// <reference path="./types.d.ts" />
const wechaty_puppet_1 = require("wechaty-puppet");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return wechaty_puppet_1.log; } });
const file_box_1 = require("file-box");
const promise_retry_1 = __importDefault(require("promise-retry"));
const package_json_js_1 = require("./package-json.js");
const VERSION = package_json_js_1.packageJson.version || '0.0.0';
exports.VERSION = VERSION;
const NAME = package_json_js_1.packageJson.name || 'NONAME';
exports.NAME = NAME;
function qrCodeForChatie() {
    const CHATIE_OFFICIAL_ACCOUNT_QRCODE = 'http://weixin.qq.com/r/qymXj7DEO_1ErfTs93y5';
    return file_box_1.FileBox.fromQRCode(CHATIE_OFFICIAL_ACCOUNT_QRCODE);
}
exports.qrCodeForChatie = qrCodeForChatie;
async function retry(retryableFn) {
    /**
     * 60 seconds: (to be confirmed)
     *  factor: 3
     *  minTimeout: 10
     *  maxTimeout: 20 * 1000
     *  retries: 9
     */
    const factor = 3;
    const minTimeout = 10;
    const maxTimeout = 20 * 1000;
    const retries = 9;
    // const unref      = true
    const retryOptions = {
        factor,
        maxTimeout,
        minTimeout,
        retries,
    };
    return (0, promise_retry_1.default)(retryOptions, retryableFn);
}
exports.retry = retry;
//# sourceMappingURL=config.js.map
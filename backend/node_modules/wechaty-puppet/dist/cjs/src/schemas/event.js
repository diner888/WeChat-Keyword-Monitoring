"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanStatus = void 0;
/**
 * The event `scan` status number.
 */
var ScanStatus;
(function (ScanStatus) {
    ScanStatus[ScanStatus["Unknown"] = 0] = "Unknown";
    ScanStatus[ScanStatus["Cancel"] = 1] = "Cancel";
    ScanStatus[ScanStatus["Waiting"] = 2] = "Waiting";
    ScanStatus[ScanStatus["Scanned"] = 3] = "Scanned";
    ScanStatus[ScanStatus["Confirmed"] = 4] = "Confirmed";
    ScanStatus[ScanStatus["Timeout"] = 5] = "Timeout";
})(ScanStatus = exports.ScanStatus || (exports.ScanStatus = {}));
//# sourceMappingURL=event.js.map
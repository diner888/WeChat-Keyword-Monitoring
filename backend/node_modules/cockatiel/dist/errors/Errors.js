"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./BrokenCircuitError"));
__export(require("./BulkheadRejectedError"));
__export(require("./IsolatedCircuitError"));
__export(require("./TaskCancelledError"));
exports.isBrokenCircuitError = (e) => !!e && e instanceof Error && 'isBrokenCircuitError' in e;
exports.isBulkheadRejectedError = (e) => !!e && e instanceof Error && 'isBulkheadRejectedError' in e;
exports.isIsolatedCircuitError = (e) => !!e && e instanceof Error && 'isBulkheadRejectedError' in e;
exports.isTaskCancelledError = (e) => !!e && e instanceof Error && 'isBulkheadRejectedError' in e;
//# sourceMappingURL=Errors.js.map
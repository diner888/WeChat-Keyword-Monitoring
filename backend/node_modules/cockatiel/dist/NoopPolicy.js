"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CancellationToken_1 = require("./CancellationToken");
const Executor_1 = require("./common/Executor");
/**
 * A no-op policy, useful for unit tests and stubs.
 */
class NoopPolicy {
    constructor() {
        this.executor = new Executor_1.ExecuteWrapper();
        // tslint:disable-next-line: member-ordering
        this.onSuccess = this.executor.onSuccess;
        // tslint:disable-next-line: member-ordering
        this.onFailure = this.executor.onFailure;
    }
    async execute(fn, cancellationToken = CancellationToken_1.CancellationToken.None) {
        return Executor_1.returnOrThrow(await this.executor.invoke(fn, { cancellationToken }));
    }
}
exports.NoopPolicy = NoopPolicy;
//# sourceMappingURL=NoopPolicy.js.map
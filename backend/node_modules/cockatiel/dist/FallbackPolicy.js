"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CancellationToken_1 = require("./CancellationToken");
class FallbackPolicy {
    constructor(executor, value) {
        this.executor = executor;
        this.value = value;
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onSuccess = this.executor.onSuccess;
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onFailure = this.executor.onFailure;
    }
    /**
     * Executes the given function.
     * @param fn Function to execute.
     * @returns The function result or fallback value.
     */
    async execute(fn, cancellationToken = CancellationToken_1.CancellationToken.None) {
        const result = await this.executor.invoke(fn, { cancellationToken });
        if ('success' in result) {
            return result.success;
        }
        return this.value();
    }
}
exports.FallbackPolicy = FallbackPolicy;
//# sourceMappingURL=FallbackPolicy.js.map
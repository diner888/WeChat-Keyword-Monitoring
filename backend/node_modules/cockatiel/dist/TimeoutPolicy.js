"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CancellationToken_1 = require("./CancellationToken");
const Event_1 = require("./common/Event");
const Executor_1 = require("./common/Executor");
const TaskCancelledError_1 = require("./errors/TaskCancelledError");
var TimeoutStrategy;
(function (TimeoutStrategy) {
    /**
     * Cooperative timeouts will simply revoke the inner cancellation token,
     * assuming the caller handles cancellation and throws or returns appropriately.
     */
    TimeoutStrategy["Cooperative"] = "optimistic";
    /**
     * Aggressive cancellation immediately throws
     */
    TimeoutStrategy["Aggressive"] = "aggressive";
})(TimeoutStrategy = exports.TimeoutStrategy || (exports.TimeoutStrategy = {}));
class TimeoutPolicy {
    constructor(duration, strategy, executor = new Executor_1.ExecuteWrapper(), unref = false) {
        this.duration = duration;
        this.strategy = strategy;
        this.executor = executor;
        this.unref = unref;
        this.timeoutEmitter = new Event_1.EventEmitter();
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onTimeout = this.timeoutEmitter.addListener;
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onFailure = this.executor.onFailure;
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onSuccess = this.executor.onSuccess;
    }
    /**
     * When timing out, a referenced timer is created. This means the Node.js
     * event loop is kept active while we're waiting for the timeout, as long as
     * the function hasn't returned. Calling this method on the timeout builder
     * will unreference the timer, allowing the process to exit even if a
     * timeout might still be happening.
     */
    dangerouslyUnref() {
        const t = new TimeoutPolicy(this.duration, this.strategy, this.executor, true);
        return t;
    }
    /**
     * Executes the given function.
     * @param fn Function to execute. Takes in a nested cancellation token.
     * @throws a {@link TaskCancelledError} if a timeout occurs
     */
    async execute(fn, ct = CancellationToken_1.CancellationToken.None) {
        const cts = new CancellationToken_1.CancellationTokenSource(ct);
        const timer = setTimeout(() => cts.cancel(), this.duration);
        if (this.unref) {
            timer.unref();
        }
        const context = { cancellation: cts.token, cancellationToken: cts.token };
        const onCancelledListener = cts.token.onCancellationRequested(() => this.timeoutEmitter.emit());
        try {
            if (this.strategy === TimeoutStrategy.Cooperative) {
                return Executor_1.returnOrThrow(await this.executor.invoke(fn, context, cts.token));
            }
            return await this.executor
                .invoke(async () => Promise.race([
                Promise.resolve(fn(context, cts.token)),
                cts.token.cancellation(cts.token).then(() => {
                    throw new TaskCancelledError_1.TaskCancelledError(`Operation timed out after ${this.duration}ms`);
                }),
            ]))
                .then(Executor_1.returnOrThrow);
        }
        finally {
            onCancelledListener.dispose();
            cts.cancel();
            clearTimeout(timer);
        }
    }
}
exports.TimeoutPolicy = TimeoutPolicy;
//# sourceMappingURL=TimeoutPolicy.js.map
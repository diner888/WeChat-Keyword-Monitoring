import { CancellationToken, CancellationTokenSource } from './CancellationToken';
import { EventEmitter } from './common/Event';
import { ExecuteWrapper, returnOrThrow } from './common/Executor';
import { TaskCancelledError } from './errors/TaskCancelledError';
export var TimeoutStrategy;
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
})(TimeoutStrategy || (TimeoutStrategy = {}));
export class TimeoutPolicy {
    constructor(duration, strategy, executor = new ExecuteWrapper(), unref = false) {
        this.duration = duration;
        this.strategy = strategy;
        this.executor = executor;
        this.unref = unref;
        this.timeoutEmitter = new EventEmitter();
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
    async execute(fn, ct = CancellationToken.None) {
        const cts = new CancellationTokenSource(ct);
        const timer = setTimeout(() => cts.cancel(), this.duration);
        if (this.unref) {
            timer.unref();
        }
        const context = { cancellation: cts.token, cancellationToken: cts.token };
        const onCancelledListener = cts.token.onCancellationRequested(() => this.timeoutEmitter.emit());
        try {
            if (this.strategy === TimeoutStrategy.Cooperative) {
                return returnOrThrow(await this.executor.invoke(fn, context, cts.token));
            }
            return await this.executor
                .invoke(async () => Promise.race([
                Promise.resolve(fn(context, cts.token)),
                cts.token.cancellation(cts.token).then(() => {
                    throw new TaskCancelledError(`Operation timed out after ${this.duration}ms`);
                }),
            ]))
                .then(returnOrThrow);
        }
        finally {
            onCancelledListener.dispose();
            cts.cancel();
            clearTimeout(timer);
        }
    }
}
//# sourceMappingURL=TimeoutPolicy.js.map
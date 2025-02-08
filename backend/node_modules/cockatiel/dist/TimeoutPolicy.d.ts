import { CancellationToken } from './CancellationToken';
import { ExecuteWrapper } from './common/Executor';
import { IPolicy } from './Policy';
export declare enum TimeoutStrategy {
    /**
     * Cooperative timeouts will simply revoke the inner cancellation token,
     * assuming the caller handles cancellation and throws or returns appropriately.
     */
    Cooperative = "optimistic",
    /**
     * Aggressive cancellation immediately throws
     */
    Aggressive = "aggressive"
}
export interface ICancellationContext {
    /**
     * @deprecated use `cancellationToken` instead
     */
    cancellation: CancellationToken;
    cancellationToken: CancellationToken;
}
export declare class TimeoutPolicy implements IPolicy<ICancellationContext> {
    private readonly duration;
    private readonly strategy;
    private readonly executor;
    private readonly unref;
    private readonly timeoutEmitter;
    /**
     * @inheritdoc
     */
    readonly onTimeout: import("./common/Event").Event<void>;
    /**
     * @inheritdoc
     */
    readonly onFailure: import("./common/Event").Event<import("./Policy").IFailureEvent>;
    /**
     * @inheritdoc
     */
    readonly onSuccess: import("./common/Event").Event<import("./Policy").ISuccessEvent>;
    constructor(duration: number, strategy: TimeoutStrategy, executor?: ExecuteWrapper, unref?: boolean);
    /**
     * When timing out, a referenced timer is created. This means the Node.js
     * event loop is kept active while we're waiting for the timeout, as long as
     * the function hasn't returned. Calling this method on the timeout builder
     * will unreference the timer, allowing the process to exit even if a
     * timeout might still be happening.
     */
    dangerouslyUnref(): TimeoutPolicy;
    /**
     * Executes the given function.
     * @param fn Function to execute. Takes in a nested cancellation token.
     * @throws a {@link TaskCancelledError} if a timeout occurs
     */
    execute<T>(fn: (context: ICancellationContext, ct: CancellationToken) => PromiseLike<T> | T, ct?: CancellationToken): Promise<T>;
}

import { IBreaker } from './breaker/Breaker';
import { CancellationToken } from './CancellationToken';
import { ExecuteWrapper } from './common/Executor';
import { IDefaultPolicyContext, IPolicy } from './Policy';
export declare enum CircuitState {
    /**
     * Normal operation. Execution of actions allowed.
     */
    Closed = 0,
    /**
     * The automated controller has opened the circuit. Execution of actions blocked.
     */
    Open = 1,
    /**
     * Recovering from open state, after the automated break duration has
     * expired. Execution of actions permitted. Success of subsequent action/s
     * controls onward transition to Open or Closed state.
     */
    HalfOpen = 2,
    /**
     * Circuit held manually in an open state. Execution of actions blocked.
     */
    Isolated = 3
}
export interface ICircuitBreakerOptions {
    breaker: IBreaker;
    halfOpenAfter: number;
}
export declare class CircuitBreakerPolicy implements IPolicy {
    private readonly options;
    private readonly executor;
    private readonly breakEmitter;
    private readonly resetEmitter;
    private readonly halfOpenEmitter;
    private readonly stateChangeEmitter;
    private innerLastFailure?;
    private innerState;
    /**
     * Event emitted when the circuit breaker opens.
     */
    readonly onBreak: import("./common/Event").Event<{
        error: Error;
    } | {
        value: unknown;
    } | {
        isolated: true;
    }>;
    /**
     * Event emitted when the circuit breaker resets.
     */
    readonly onReset: import("./common/Event").Event<void>;
    /**
     * Event emitted when the circuit breaker is half open (running a test call).
     * Either `onBreak` on `onReset` will subsequently fire.
     */
    readonly onHalfOpen: import("./common/Event").Event<void>;
    /**
     * Fired whenever the circuit breaker state changes.
     */
    readonly onStateChange: import("./common/Event").Event<CircuitState>;
    /**
     * @inheritdoc
     */
    readonly onSuccess: import("./common/Event").Event<import("./Policy").ISuccessEvent>;
    /**
     * @inheritdoc
     */
    readonly onFailure: import("./common/Event").Event<import("./Policy").IFailureEvent>;
    /**
     * Gets the current circuit breaker state.
     */
    get state(): CircuitState;
    /**
     * Gets the last reason the circuit breaker failed.
     */
    get lastFailure(): {
        error: Error;
    } | {
        value: unknown;
    } | undefined;
    constructor(options: ICircuitBreakerOptions, executor: ExecuteWrapper);
    /**
     * Manually holds open the circuit breaker.
     * @returns A handle that keeps the breaker open until `.dispose()` is called.
     */
    isolate(): {
        dispose: () => void;
    };
    /**
     * Executes the given function.
     * @param fn Function to run
     * @throws a {@link BrokenCircuitError} if the circuit is open
     * @throws a {@link IsolatedCircuitError} if the circuit is held
     * open via {@link CircuitBreakerPolicy.isolate}
     * @returns a Promise that resolves or rejects with the function results.
     */
    execute<T>(fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T, cancellationToken?: CancellationToken): Promise<T>;
    private halfOpen;
    private open;
    private close;
}

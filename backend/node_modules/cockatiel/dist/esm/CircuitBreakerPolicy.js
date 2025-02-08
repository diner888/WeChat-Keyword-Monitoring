import { CancellationToken } from './CancellationToken';
import { EventEmitter } from './common/Event';
import { returnOrThrow } from './common/Executor';
import { BrokenCircuitError, TaskCancelledError } from './errors/Errors';
import { IsolatedCircuitError } from './errors/IsolatedCircuitError';
export var CircuitState;
(function (CircuitState) {
    /**
     * Normal operation. Execution of actions allowed.
     */
    CircuitState[CircuitState["Closed"] = 0] = "Closed";
    /**
     * The automated controller has opened the circuit. Execution of actions blocked.
     */
    CircuitState[CircuitState["Open"] = 1] = "Open";
    /**
     * Recovering from open state, after the automated break duration has
     * expired. Execution of actions permitted. Success of subsequent action/s
     * controls onward transition to Open or Closed state.
     */
    CircuitState[CircuitState["HalfOpen"] = 2] = "HalfOpen";
    /**
     * Circuit held manually in an open state. Execution of actions blocked.
     */
    CircuitState[CircuitState["Isolated"] = 3] = "Isolated";
})(CircuitState || (CircuitState = {}));
export class CircuitBreakerPolicy {
    constructor(options, executor) {
        this.options = options;
        this.executor = executor;
        this.breakEmitter = new EventEmitter();
        this.resetEmitter = new EventEmitter();
        this.halfOpenEmitter = new EventEmitter();
        this.stateChangeEmitter = new EventEmitter();
        this.innerState = { value: CircuitState.Closed };
        /**
         * Event emitted when the circuit breaker opens.
         */
        // tslint:disable-next-line: member-ordering
        this.onBreak = this.breakEmitter.addListener;
        /**
         * Event emitted when the circuit breaker resets.
         */
        // tslint:disable-next-line: member-ordering
        this.onReset = this.resetEmitter.addListener;
        /**
         * Event emitted when the circuit breaker is half open (running a test call).
         * Either `onBreak` on `onReset` will subsequently fire.
         */
        // tslint:disable-next-line: member-ordering
        this.onHalfOpen = this.halfOpenEmitter.addListener;
        /**
         * Fired whenever the circuit breaker state changes.
         */
        // tslint:disable-next-line: member-ordering
        this.onStateChange = this.stateChangeEmitter.addListener;
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
     * Gets the current circuit breaker state.
     */
    get state() {
        return this.innerState.value;
    }
    /**
     * Gets the last reason the circuit breaker failed.
     */
    get lastFailure() {
        return this.innerLastFailure;
    }
    /**
     * Manually holds open the circuit breaker.
     * @returns A handle that keeps the breaker open until `.dispose()` is called.
     */
    isolate() {
        if (this.innerState.value !== CircuitState.Isolated) {
            this.innerState = { value: CircuitState.Isolated, counters: 0 };
            this.breakEmitter.emit({ isolated: true });
            this.stateChangeEmitter.emit(CircuitState.Isolated);
        }
        this.innerState.counters++;
        let disposed = false;
        return {
            dispose: () => {
                if (disposed) {
                    return;
                }
                disposed = true;
                if (this.innerState.value === CircuitState.Isolated && !--this.innerState.counters) {
                    this.innerState = { value: CircuitState.Closed };
                    this.resetEmitter.emit();
                    this.stateChangeEmitter.emit(CircuitState.Closed);
                }
            },
        };
    }
    /**
     * Executes the given function.
     * @param fn Function to run
     * @throws a {@link BrokenCircuitError} if the circuit is open
     * @throws a {@link IsolatedCircuitError} if the circuit is held
     * open via {@link CircuitBreakerPolicy.isolate}
     * @returns a Promise that resolves or rejects with the function results.
     */
    async execute(fn, cancellationToken = CancellationToken.None) {
        const state = this.innerState;
        switch (state.value) {
            case CircuitState.Closed:
                const result = await this.executor.invoke(fn, { cancellationToken });
                if ('success' in result) {
                    this.options.breaker.success(state.value);
                }
                else {
                    this.innerLastFailure = result;
                    if (this.options.breaker.failure(state.value)) {
                        this.open(result);
                    }
                }
                return returnOrThrow(result);
            case CircuitState.HalfOpen:
                await state.test.catch(() => undefined);
                if (this.state === CircuitState.Closed && cancellationToken.isCancellationRequested) {
                    throw new TaskCancelledError();
                }
                return this.execute(fn);
            case CircuitState.Open:
                if (Date.now() - state.openedAt < this.options.halfOpenAfter) {
                    throw new BrokenCircuitError();
                }
                const test = this.halfOpen(fn, cancellationToken);
                this.innerState = { value: CircuitState.HalfOpen, test };
                this.stateChangeEmitter.emit(CircuitState.HalfOpen);
                return test;
            case CircuitState.Isolated:
                throw new IsolatedCircuitError();
            default:
                throw new Error(`Unexpected circuit state ${state}`);
        }
    }
    async halfOpen(fn, cancellationToken) {
        this.halfOpenEmitter.emit();
        try {
            const result = await this.executor.invoke(fn, { cancellationToken });
            if ('success' in result) {
                this.options.breaker.success(CircuitState.HalfOpen);
                this.close();
            }
            else {
                this.innerLastFailure = result;
                this.options.breaker.failure(CircuitState.HalfOpen);
                this.open(result);
            }
            return returnOrThrow(result);
        }
        catch (err) {
            // It's an error, but not one the circuit is meant to retry, so
            // for our purposes it's a success. Task failed successfully!
            this.close();
            throw err;
        }
    }
    open(reason) {
        if (this.state === CircuitState.Isolated || this.state === CircuitState.Open) {
            return;
        }
        this.innerState = { value: CircuitState.Open, openedAt: Date.now() };
        this.breakEmitter.emit(reason);
        this.stateChangeEmitter.emit(CircuitState.Open);
    }
    close() {
        if (this.state === CircuitState.HalfOpen) {
            this.innerState = { value: CircuitState.Closed };
            this.resetEmitter.emit();
            this.stateChangeEmitter.emit(CircuitState.Closed);
        }
    }
}
//# sourceMappingURL=CircuitBreakerPolicy.js.map
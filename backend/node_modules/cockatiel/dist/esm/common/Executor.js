import { EventEmitter } from './Event';
export const returnOrThrow = (failure) => {
    if ('error' in failure) {
        throw failure.error;
    }
    if ('success' in failure) {
        return failure.success;
    }
    return failure.value;
};
const makeStopwatch = () => {
    if (typeof performance !== 'undefined') {
        const start = performance.now();
        return () => performance.now() - start;
    }
    else {
        const start = process.hrtime.bigint();
        return () => Number(process.hrtime.bigint() - start) / 1000000; // ns->ms
    }
};
export class ExecuteWrapper {
    constructor(errorFilter = () => false, resultFilter = () => false) {
        this.errorFilter = errorFilter;
        this.resultFilter = resultFilter;
        this.successEmitter = new EventEmitter();
        this.failureEmitter = new EventEmitter();
        // tslint:disable-next-line: member-ordering
        this.onSuccess = this.successEmitter.addListener;
        // tslint:disable-next-line: member-ordering
        this.onFailure = this.failureEmitter.addListener;
    }
    derive() {
        const e = new ExecuteWrapper(this.errorFilter, this.resultFilter);
        e.onSuccess(evt => this.successEmitter.emit(evt));
        e.onFailure(evt => this.failureEmitter.emit(evt));
        return e;
    }
    async invoke(fn, ...args) {
        const stopwatch = this.successEmitter.size || this.failureEmitter.size ? makeStopwatch() : null;
        try {
            const value = await fn(...args);
            if (!this.resultFilter(value)) {
                if (stopwatch) {
                    this.successEmitter.emit({ duration: stopwatch() });
                }
                return { success: value };
            }
            if (stopwatch) {
                this.failureEmitter.emit({ duration: stopwatch(), handled: true, reason: { value } });
            }
            return { value };
        }
        catch (error) {
            const handled = this.errorFilter(error);
            if (stopwatch) {
                this.failureEmitter.emit({ duration: stopwatch(), handled, reason: { error } });
            }
            if (!handled) {
                throw error;
            }
            return { error };
        }
    }
}
//# sourceMappingURL=Executor.js.map
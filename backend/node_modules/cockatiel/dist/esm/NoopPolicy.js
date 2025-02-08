import { CancellationToken } from './CancellationToken';
import { ExecuteWrapper, returnOrThrow } from './common/Executor';
/**
 * A no-op policy, useful for unit tests and stubs.
 */
export class NoopPolicy {
    constructor() {
        this.executor = new ExecuteWrapper();
        // tslint:disable-next-line: member-ordering
        this.onSuccess = this.executor.onSuccess;
        // tslint:disable-next-line: member-ordering
        this.onFailure = this.executor.onFailure;
    }
    async execute(fn, cancellationToken = CancellationToken.None) {
        return returnOrThrow(await this.executor.invoke(fn, { cancellationToken }));
    }
}
//# sourceMappingURL=NoopPolicy.js.map
import { CancellationToken } from './CancellationToken';
import { IDefaultPolicyContext, IPolicy } from './Policy';
/**
 * A no-op policy, useful for unit tests and stubs.
 */
export declare class NoopPolicy implements IPolicy {
    private readonly executor;
    readonly onSuccess: import(".").Event<import("./Policy").ISuccessEvent>;
    readonly onFailure: import(".").Event<import("./Policy").IFailureEvent>;
    execute<T>(fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T, cancellationToken?: CancellationToken): Promise<T>;
}

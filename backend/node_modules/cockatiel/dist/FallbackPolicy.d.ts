import { CancellationToken } from './CancellationToken';
import { ExecuteWrapper } from './common/Executor';
import { IDefaultPolicyContext, IPolicy } from './Policy';
export declare class FallbackPolicy<AltReturn> implements IPolicy<IDefaultPolicyContext, AltReturn> {
    private readonly executor;
    private readonly value;
    /**
     * @inheritdoc
     */
    readonly onSuccess: import(".").Event<import("./Policy").ISuccessEvent>;
    /**
     * @inheritdoc
     */
    readonly onFailure: import(".").Event<import("./Policy").IFailureEvent>;
    constructor(executor: ExecuteWrapper, value: () => AltReturn);
    /**
     * Executes the given function.
     * @param fn Function to execute.
     * @returns The function result or fallback value.
     */
    execute<T>(fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T, cancellationToken?: CancellationToken): Promise<T | AltReturn>;
}

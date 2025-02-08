import { Action } from 'redux';
import { OperatorFunction } from 'rxjs';
/**
 * Inferring the types of this is a bit challenging, and only works in newer
 * versions of TypeScript.
 *
 * @param ...types One or more Redux action types you want to filter for, variadic.
 */
export declare function ofType<Input extends Action, Type extends Input['type'], Output extends Input = Extract<Input, Action<Type>>>(...types: [Type, ...Type[]]): OperatorFunction<Input, Output>;
//# sourceMappingURL=operators.d.ts.map
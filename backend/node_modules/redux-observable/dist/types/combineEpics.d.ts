import { Action } from 'redux';
import { Epic } from './epic';
/**
  Merges all epics into a single one.
 */
export declare function combineEpics<T extends Action, O extends T = T, S = void, D = any>(...epics: Epic<T, O, S, D>[]): Epic<T, O, S, D>;
//# sourceMappingURL=combineEpics.d.ts.map
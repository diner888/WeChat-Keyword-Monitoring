import { Observable } from 'rxjs';
export declare class StateObservable<S> extends Observable<S> {
    value: S;
    private __notifier;
    constructor(input$: Observable<S>, initialState: S);
}
//# sourceMappingURL=StateObservable.d.ts.map
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Subscribable } from "./types";

export interface Store<T> extends Subscribable<T> {
  state$: Observable<T>;
  getState: () => T;
  setState: (nextState: T) => void;
  select: <R>(selector: (state: T) => R) => Observable<R>;
  on: <E>(
    trigger: Subscribable<E>,
    reduce: (state: T, payload: E) => T
  ) => Store<T>;
}

export function createStore<T>(initialState: T): Store<T> {
  const internalState$ = new BehaviorSubject(initialState);

  const state$ = internalState$.asObservable();

  const store = {
    state$,
    getState,
    setState,
    select,
    on,
    subscribe,
  };

  function getState() {
    return internalState$.getValue();
  }

  function setState(nextState: T) {
    internalState$.next(nextState);
  }

  function select<R>(selector: (state: T) => R): Observable<R> {
    return state$.pipe(map((state) => selector(state)));
  }

  function on<E>(
    trigger: Subscribable<E>,
    reducer: (state: T, payload: E) => T
  ) {
    trigger.subscribe((data) => {
      setState(reducer(getState(), data));
    });

    return store;
  }

  function subscribe(observer: (value: T) => void) {
    return state$.subscribe(observer);
  }

  return store;
}

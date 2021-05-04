import { useLayoutEffect, useReducer, useRef } from "react";
import { Observable } from "rxjs";

export function useObservable<T, S extends T>(
  observable: Observable<T>,
  initialState: S
) {
  const update = useReducer((n: number) => n + 1, 0)[1];

  const currentValueRef = useRef<T>(initialState);

  useLayoutEffect(() => {
    const subscription = observable.subscribe((data) => {
      currentValueRef.current = data;
      update();
    });

    return () => subscription.unsubscribe();
  }, [update, observable]);

  return currentValueRef.current;
}

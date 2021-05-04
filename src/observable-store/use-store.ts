import { useLayoutEffect, useReducer, useRef } from "react";
import { Store } from "./create-store";

export function useStore<T>(store: Store<T>) {
  const update = useReducer((n: number) => n + 1, 0)[1];

  const currentStoreRef = useRef<T>(store.getState());

  useLayoutEffect(() => {
    const subscription = store.subscribe((data) => {
      currentStoreRef.current = data;
      update();
    });

    return () => subscription.unsubscribe();
  }, [update, store]);

  return currentStoreRef.current;
}

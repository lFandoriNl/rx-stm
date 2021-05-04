import { Observable, Subject } from "rxjs";
import { Subscribable } from "./types";

export interface Event<T> extends Subscribable<T> {
  (value: T): void;
  stream$: Observable<T>;
}

export function createEvent<T = void>(): Event<T> {
  const internalStream$ = new Subject<T>();

  const event = (value: T) => {
    internalStream$.next(value);
  };

  event.stream$ = internalStream$.asObservable();

  event.subscribe = (observer: (value: T) => void) => {
    return event.stream$.subscribe(observer);
  };

  return event;
}

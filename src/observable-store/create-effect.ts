import { Observable } from "rxjs";
import { Event } from "./create-event";
import { Subscribable } from "./types";

export interface Effect<T, R> extends Subscribable<T> {
  (value: T): Observable<R>;
}

export function createEffect<T = void, R = void>(
  event: Event<T>,
  observer: (observable: Observable<T>) => Observable<R>
): Observable<R> {
  const source = observer(event.stream$);

  return source;
}

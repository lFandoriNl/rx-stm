import { Subscription } from "rxjs";

export interface Subscribable<T> {
  subscribe(observer: (value: T) => void): Subscription;
}

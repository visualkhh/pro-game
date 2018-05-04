import {Intent} from './Intent';

export interface IntentSignal<T> {
  // clockSignal(...values: any[]);
  intentSignal(intent: Intent<T>);
}

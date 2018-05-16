import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
// import 'rxjs/operator/merge';
import 'rxjs/add/operator/merge';
import { distinctUntilChanged } from 'rxjs/operators';
// import 'rxjs/operators/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/groupBy';
// import 'rxjs/add/operator/mergeAll';

export class DeviceManager {

  private static instance: DeviceManager;
  private headsetConcentrationObservable: Observable<number>;

  static readonly EVENT_OMNIFIT_HEADSET_CONCENTRATION = 'omnifit-headset-concentration';
  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance() {
    if (!DeviceManager.instance) {
      DeviceManager.instance = new DeviceManager();
    }
    return DeviceManager.instance;
  }

  private constructor() {
    this.headsetConcentrationObservable = Observable.fromEvent(window, DeviceManager.EVENT_OMNIFIT_HEADSET_CONCENTRATION).map((event: CustomEvent) => Number(event.detail) );
  }

  public fromeEvent(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription  {
    const key = Observable.fromEvent(window, eventName);
    return key.subscribe(next, error, complete);
  }
  public dispatchCustomEvent(event: CustomEvent ): boolean {
    return window.dispatchEvent(event);
  }

  public headsetConcentrationSubscribe(next?: (value: number) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.headsetConcentrationObservable.subscribe(next, error, complete);
  }
}

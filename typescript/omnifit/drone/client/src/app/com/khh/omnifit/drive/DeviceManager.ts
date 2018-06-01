import 'rxjs/add/observable/interval';
// import 'rxjs/operators/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/operator/merge';
import 'rxjs/add/operator/merge';
import {Observable} from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {DroneStageManager} from '../game/drone/DroneStageManager';
// import 'rxjs/add/operator/groupBy';
// import 'rxjs/add/operator/mergeAll';

export class DeviceManager {

  static readonly EVENT_OMNIFIT_HEADSET_CONCENTRATION = 'omnifit-headset-concentration';
  static readonly EVENT_OMNIFIT_WEBSOCKET_SEND = 'omnifit-webSocket-send';
  private static instance: DeviceManager;
  private _headsetConcentrationObservable: Observable<number>;

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance() {
    if (!DeviceManager.instance) {
      DeviceManager.instance = new DeviceManager();
    }
    return DeviceManager.instance;
  }

  private constructor() {
    this._headsetConcentrationObservable = Observable.fromEvent(window, DeviceManager.EVENT_OMNIFIT_HEADSET_CONCENTRATION).map((event: CustomEvent) => Number(event.detail) );
    Observable.fromEvent(window, DeviceManager.EVENT_OMNIFIT_WEBSOCKET_SEND).subscribe((event: CustomEvent) => {
      console.log('mnifit-webSocket-send' + event);
      DroneStageManager.getInstance().webSocketSubject.next(event.detail);
    });
  }

  public fromeEvent(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription  {
    const key = Observable.fromEvent(window, eventName);
    return key.subscribe(next, error, complete);
  }
  public dispatchCustomEvent(event: CustomEvent ): boolean {
    return window.dispatchEvent(event);
  }

  get headsetConcentrationObservable(): Observable<number> {
    return this._headsetConcentrationObservable;
  }

  public headsetConcentrationSubscribe(next?: (value: number) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this._headsetConcentrationObservable.subscribe(next, error, complete);
  }
}

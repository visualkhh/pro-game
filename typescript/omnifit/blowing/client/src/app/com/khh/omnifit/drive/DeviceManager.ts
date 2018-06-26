import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/merge';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

export class DeviceManager {

  static readonly EVENT_OMNIFIT_HEADSET_CONCENTRATION = 'omnifit-headset-concentration';
  // static readonly EVENT_OMNIFIT_WEBSOCKET_SEND = 'omnifit-webSocket-send';
  private static instance: DeviceManager;
  private _headsetConcentrationObservable: Observable<number>;
  private concentrationSubscription: Subscription;
  private keySubscription: Subscription;
  private headsetConcentration = 0;
  private headsetConcentrationHistory = new Array<number>();

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
    this.concentrationSubscription = this.headsetConcentrationSubscribe((concentration) => {
      this.headsetConcentration = concentration;
      this.headsetConcentrationHistory.push(concentration);
      console.log('headsetConcentration' + this.headsetConcentration + ', history ' + this.headsetConcentrationHistory);
    });
    this.keySubscription = this.fromeEvent('keydown', (e: KeyboardEvent) => {
      let at = (this.headsetConcentration || 0);
      if ('ArrowUp' === e.key) {
        at++;
      }else if ('ArrowDown' === e.key) {
        at--;
      }
      at = Math.min(10, at);
      at = Math.max(0, at);
      this.dispatchCustomEvent(new CustomEvent(DeviceManager.EVENT_OMNIFIT_HEADSET_CONCENTRATION, {detail: at}));
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

  public onCreate(data?: any) { //	called when activity is first created.
    if (window['omnigame']) {
      window['omnigame'].onCreate(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.onCreate) {
      window['webkit'].messageHandlers.onCreate.postMessage(data);
    }
  }
  public onStart(data?: any) { //	called when activity is becoming visible to the user.
    if (window['omnigame']) {
      window['omnigame'].onStart(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.onStart) {
      window['webkit'].messageHandlers.onStart.postMessage(data);
    }
  }
  public onResume(data?: any) { //	called when activity will start interacting with the user.
    if (window['omnigame']) {
      window['omnigame'].onResume(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.onResume) {
      window['webkit'].messageHandlers.onResume.postMessage(data);
    }
  }
  public onPause(data?: any) { //	called when activity is not visible to the user.
    if (window['omnigame']) {
      window['omnigame'].onPause(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.onPause) {
      window['webkit'].messageHandlers.onPause.postMessage(data);
    }
  }
  public onStop(data?: any) { //	called when activity is no longer visible to the user.
    if (window['omnigame']) {
      window['omnigame'].onStop(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.onStop) {
      window['webkit'].messageHandlers.onStop.postMessage(data);
    }
  }
  public onRestart(data?: any) { //	called after your activity is stopped, prior to start.
    if (window['omnigame']) {
      window['omnigame'].onRestart(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers) {
      window['webkit'].messageHandlers.onRestart.postMessage(data);
    }
  }
  public onDestroy(data?: any) { //	called before the activity is destroyed.
    if (window['omnigame']) {
      window['omnigame'].onDestroy(data);
    }else if (window['webkit'] && window['webkit'].messageHandlers) {
      window['webkit'].messageHandlers.onDestroy.postMessage(data);
    }
  }

}

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

export class DeviceManager {

  private static instance: DeviceManager;
  private headsetConcentrationObservable: Observable<number>;

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance() {
    if (!DeviceManager.instance) {
      DeviceManager.instance = new DeviceManager();
    }
    return DeviceManager.instance;
  }


  private constructor() {
    this.init();
  }

  private init() {
    //addEventListener
    this.headsetConcentrationObservable = Observable.fromEvent(window, 'omnifit-headset-concentration').map((event: CustomEvent) => Number(event.detail) );
  }

  public headsetConcentrationSubscribe(next?: (value: number) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.headsetConcentrationObservable.subscribe(next, error, complete);
  }
}

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ObjDrone} from '../obj/ObjDrone';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {Stage} from '../../../../../../../../lib-typescript/com/khh/stage/Stage';
import {interval} from 'rxjs/observable/interval';

export abstract class DroneStage extends Stage implements LifeCycle {



  private _canvas: HTMLCanvasElement;
  // private nextSource;
  // private nextObserver:Subscriber<any>;
  // private previousSource;
  // private previousObserver:Subscriber<any>;
  private _objs: Array<ObjDrone>;
  private clock: Observable<Date>;
  public clockInterval = 10;
  constructor(canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super();
    this._canvas = canvas;
    this._objs = objs;



    // this.nextSource = Observable.create((observer:Subscriber<any>) => {
    //   this.nextObserver = observer;
    // });
    // this.previousSource = Observable.create((observer:Subscriber<any>) => {
    //   this.previousObserver = observer;
    // });
    // this._droneStageManager = droneStageManager;
  }

  objPush(obj: ObjDrone) {
    this.objs.push(obj);
    obj.onCreate();
    // obj.onStart();
  }

  get objs(): Array<ObjDrone> {
    return this._objs.sort((n1, n2) => (n1.z > n2.z ? 1 : -1));
  }



  // public nextStage(data?: any): void {
  //   return this.nextObserver.next(data) ;
  // }
  // public previousStage(data?: any): void {
  //   return this.previousObserver.next(data);
  // }

  // public nextSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
  //   return this.nextSource.subscribe(next, error, completed);
  // }
  // public previousSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
  //   return this.previousSource.subscribe(next, error, completed);
  // }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }


  abstract onDraw(canvas?: HTMLCanvasElement): void;


  public clockSubscribe(next: (value: Date) => void): Subscription {
    return this.clock.subscribe(next);
  }

  public subscribe(observableName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    if (this[observableName]) {
    return this[observableName].subscribe(next, error, complete);
    }
  }

  //LifeCycle
  onCreate() {
    this.clock = interval(this.clockInterval).map(_ => new Date());
  }

  onDestroy() {
  }

  onPause() {
  }

  onRestart() {
  }

  onResume() {
  }

  onStart(data?: any) {
    this.objs.forEach(it => it.onStart(data));
    this.onDraw();
  }

  onStop(data?: any) {
    this.objs.forEach(it => it.onStop(data));
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  // eventSignal(event: Event): void {
  // }


}

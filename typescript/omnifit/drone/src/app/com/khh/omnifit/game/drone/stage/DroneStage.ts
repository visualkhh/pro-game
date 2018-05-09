import {ClockStage} from '../../../../../../../../lib-typescript/com/khh/stage/ClockStage';
import {Clock} from '../../../../../../../../lib-typescript/com/khh/clock/Clock';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';
import {ObjDrone} from '../obj/ObjDrone';
import {IntentSignal} from '../../../../../../../../lib-typescript/com/khh/data/IntentSignal';
import {Intent} from '../../../../../../../../lib-typescript/com/khh/data/Intent';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {MouseSignal} from '../../../../../../../../lib-typescript/com/khh/event/io/mouse/MouseSignal';
import {KeyboardSignal} from '../../../../../../../../lib-typescript/com/khh/event/io/keyboard/KeyboardSignal';
import {ViewInterface} from '../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';

export abstract class DroneStage extends ClockStage implements LifeCycle, IntentSignal<number>, MouseSignal, KeyboardSignal, ViewInterface {



  private _canvas: HTMLCanvasElement;
  private nextSource;
  private nextObserver:Subscriber<any>;
  private previousSource;
  private previousObserver:Subscriber<any>;
  private _objs: Array<ObjDrone>;

  constructor(clock: Clock, canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super(clock);
    this._canvas = canvas;
    this._objs = objs;



    this.nextSource = Observable.create((observer:Subscriber<any>) => {
      this.nextObserver = observer;
    });
    this.previousSource = Observable.create((observer:Subscriber<any>) => {
      this.previousObserver = observer;
    });
    // this._droneStageManager = droneStageManager;
  }

  objPush(obj: ObjDrone){
    this.objs.push(obj);
    // obj.onCreate();
    // obj.onStart();
  }

  get objs(): Array<ObjDrone> {
    return this._objs.sort((n1,n2)=> (n1.z > n2.z ? 1 : -1));
  }


  public next(data?: any): void {
    return this.nextObserver.next(data) ;
  }
  public previous(data?: any): void {
    return this.previousObserver.next(data);
  }
  public nextSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
    return this.nextSource.subscribe(next, error, completed);
  }
  public previousSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
    return this.previousSource.subscribe(next, error, completed);
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }

  clockSignal(value: number) {
    this.onDraw();
  }

  abstract onDraw(canvas?: HTMLCanvasElement): void;


  //event
  keydown(event: KeyboardEvent): void {
  }

  keyup(event: KeyboardEvent): void {
  }

  mousedown(event: MouseEvent): void {
  }

  mousemove(event: MouseEvent): void {
  }

  mouseup(event: MouseEvent): void {
  }

  //LifeCycle
  onCreate() {
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
    this.objs.forEach(it=>it.onStart(data));
    this.onDraw();
  }

  onStop(data?: any) {
    this.objs.forEach(it=>it.onStop(data));
    let context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  intentSignal(intent: Intent<number>) {
  }

  // eventSignal(event: Event): void {
  // }


}

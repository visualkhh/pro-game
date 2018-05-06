import {ClockStage} from '../../../../stage/ClockStage';
import {Stage} from '../../../../stage/Stage';
import {Clock} from '../../../../clock/Clock';
import {DroneStageManager} from './DroneStageManager';
import {Observable, Subscribable} from 'rxjs/Observable';
import {TeardownLogic} from 'rxjs/src/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';
import {Obj} from '../../../../obj/Obj';
import {ObjDrone} from '../obj/ObjDrone';
import {IntentSignal} from '../../../../data/IntentSignal';
import {Intent} from '../../../../data/Intent';

export abstract class DroneStage extends ClockStage implements LifeCycle, IntentSignal<number>, MouseSignal, KeyboardSignal{



  private _canvas: HTMLCanvasElement;
  // private _droneStageManager: DroneStageManager;
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
    obj.onCreate();
    obj.onStart();
  }

  get objs(): Array<ObjDrone> {
    return this._objs.sort((n1,n2)=> (n1.z > n2.z ? 1 : -1));
  }


  public next(): void {
    return this.nextObserver.next();
  }
  public previous(): void {
    return this.previousObserver.next();
  }
  public nextSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
    return this.nextSource.subscribe(next, error, completed);
  }
  public previousSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
    return this.previousSource.subscribe(next, error, completed);
  }

  // get droneStageManager(): DroneStageManager {
  //   return this._droneStageManager;
  // }
  //
  // set droneStageManager(value: DroneStageManager) {
  //   this._droneStageManager = value;
  // }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }


  clockSignal(value: number) {
    this.onDraw();
  }



  abstract onDraw(): void;




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

  onStart() {
    this.objs.forEach(it=>it.onStart());
    this.onDraw();
  }

  onStop() {
    this.objs.forEach(it=>it.onStop());
    let context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  intentSignal(intent: Intent<number>) {
  }


}

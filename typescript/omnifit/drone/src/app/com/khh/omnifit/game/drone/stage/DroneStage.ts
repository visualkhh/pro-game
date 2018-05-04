import {ClockStage} from '../../../../stage/ClockStage';
import {Stage} from '../../../../stage/Stage';
import {Clock} from '../../../../clock/Clock';
import {DroneStageManager} from './DroneStageManager';
import {Observable, Subscribable} from 'rxjs/Observable';
import {TeardownLogic} from 'rxjs/src/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';
import {Obj} from '../../../../obj/Obj';

export abstract class DroneStage extends ClockStage{


  private _canvas: HTMLCanvasElement;
  // private _droneStageManager: DroneStageManager;
  private nextSource;
  private nextObserver:Subscriber<any>;
  private previousSource;
  private previousObserver:Subscriber<any>;
  private _objs: Array<Obj>;

  constructor(clock: Clock, canvas: HTMLCanvasElement, objs: Array<Obj> = new Array<Obj>()) {
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

  objPush(obj: Obj){
    this.objs.push(obj);
  }

  get objs(): Array<Obj> {
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

  start(): void {
    this.onDraw();
  }
  stop(): void {
    let context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  abstract onDraw(): void;

  mousedown(event: MouseEvent): void{

  }

  mousemove(event: MouseEvent): void{

  }

  mouseup(event: MouseEvent): void{

  }

  keydown(event: KeyboardEvent): void {

  }

  keyup(event: MouseEvent): void {

  }

}

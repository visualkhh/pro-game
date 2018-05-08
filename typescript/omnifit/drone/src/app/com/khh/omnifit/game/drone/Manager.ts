import {DroneStageIntro} from './stage/DroneStageIntro';
import {Clock} from '../../../clock/Clock';
import {DroneStageManager} from './stage/DroneStageManager';
import {DroneStageGame} from './stage/DroneStageGame';
import {DroneStageEnd} from './stage/DroneStageEnd';
import {IntentSignal} from '../../../data/IntentSignal';
import {Intent} from '../../../data/Intent';

// import { Point } from '../org/Point';
export class Manager implements IntentSignal<number>, MouseSignal, KeyboardSignal, EventSignal{


  private _canvas: HTMLCanvasElement;


  // private _data: any;
  // private dataObservableSource: any;
  // private dataObserver: Subscriber<any>;


  public constructor(canvas: HTMLCanvasElement) {
    this.init(canvas);
  }

  // private static instance: Manager;
  // static getInstance() {
  //   if (!Manager.instance) {
  //     Manager.instance = new Manager();
  //   }
  //   return Manager.instance;
  // }


  private droneStageManager: DroneStageManager;

  private init(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.droneStageManager = new DroneStageManager(this._canvas);
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  intentSignal(intent: Intent<number>) {
    this.droneStageManager.currentStage().intentSignal(intent)
  }
  // get data(): any {
  //   return this._data;
  // }
  //
  // set data(value: any) {
  //   this._data = value;
  //   this.dataObserver.next(this._data);
  // }

  // public addDataSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
  //   return this.dataObservableSource.subscribe(next, error, completed);
  // }

  mousedown(event: MouseEvent): void{
    // console.log("Manager mouseDown");
    this.droneStageManager.currentStage().mousedown(event);
  }

  mousemove(event: MouseEvent): void{
    // console.log("Manager mouseMove "+event.offsetX+","+event.offsetY);
    this.droneStageManager.currentStage().mousemove(event);
  }

  mouseup(event: MouseEvent): void{
    // console.log("Manager mouseUp");
    this.droneStageManager.currentStage().mouseup(event);
  }

  keydown(event: KeyboardEvent): void {
    // console.log("Manager keyDown");
    this.droneStageManager.currentStage().keydown(event);
  }

  keyup(event: KeyboardEvent): void {
    // console.log("Manager keyUp");
    this.droneStageManager.currentStage().keyup(event);
  }
  eventSignal(event: Event): void {
    this.droneStageManager.currentStage().eventSignal(event);
  }
  draw(): void{
    // console.log("manager --> Draw");
    this.droneStageManager.currentStage().onDraw();
    //this.clock.signalForce();
    // console.log(this.stage.next());
    // this.clock.subscribe((x)=>console.log("x-- "+x))
    // this.clock.subscribe((b)=>console.log("b-- "+b))
    // this.clock.subscribe((c)=>console.log("c-- "+c))
    // // setTimeout(()=>this.clock.unsubscribe(),5000)
    // setTimeout(()=>this.clock.iterval=5000,5000)
    //set
    // this.drones.set();
    // this.grounds.set();
    // this.clouds.set();

    ///////////draw
    // this.drones.onDraw(canvas);
    // this.grounds.onDraw(canvas);
    // this.clouds.onDraw(canvas);
  }




}

import {DroneStage} from './stage/DroneStage';
import {Clock} from '../../../clock/Clock';
import {DroneStageIntro} from './stage/DroneStageIntro';
import {DroneStageGame} from './stage/DroneStageGame';
import {DroneStageEnd} from './stage/DroneStageEnd';
import {IntentSignal} from '../../../data/IntentSignal';
import {Intent} from '../../../data/Intent';
import {Observable} from 'rxjs/Observable';

export class DroneStageManager implements IntentSignal<number>, LifeCycle {




  private position: number = 0;
  private stages: Array<DroneStage>;
  private canvas: HTMLCanvasElement;
  private clock: Clock;

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  private static instance: DroneStageManager;
  static getInstance(canvas: HTMLCanvasElement) {
    if (!DroneStageManager.instance) {
      DroneStageManager.instance = new DroneStageManager(canvas);
    }
    return DroneStageManager.instance;
  }




  private constructor(canvas: HTMLCanvasElement) {
    this.stages = new Array<DroneStage>();
    this.canvas= canvas;
    this.init();
  }

  private init() {
    this.clock = new Clock(10);
    this.pushStage(new DroneStageIntro(this.clock, this.canvas));
    this.pushStage(new DroneStageGame(this.clock, this.canvas,));
    this.pushStage(new DroneStageEnd(this.clock, this.canvas));



    //addEventListener
    Observable.fromEvent(this.canvas, 'mousedown').subscribe((event: MouseEvent)=>{
      this.currentStage().mousedown(event);
    });
    Observable.fromEvent(this.canvas, 'mouseup').subscribe((event: MouseEvent)=>{
      this.currentStage().mouseup(event);
    });
    Observable.fromEvent(this.canvas, 'mousemove').subscribe((event: MouseEvent)=>{
      this.currentStage().mousemove(event);
    });
    Observable.fromEvent(this.canvas, 'keydown').subscribe((event: KeyboardEvent)=>{
      this.currentStage().keydown(event);
    });
    Observable.fromEvent(this.canvas, 'keyup').subscribe((event: KeyboardEvent)=>{
      this.currentStage().keyup(event);
    });
    Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event)=>{
      this.currentStage().onDraw();
    });


  }

  public nextPosition(): number{
    let p = this.position;
    p++;
    if(p >= this.stages.length){
      p = this.stages.length-1;
    }
    return p;
  }
  public previousPosition(): number{
    let p = this.position;
    p--;
    if(p < 0){
      p = 0;
    }
    return p;
  }


  public next(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.nextPosition();
    let nextStage: DroneStage = this.stages[this.position];
    nextStage.onStart(data);
    return nextStage;

  }
  public previous(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.previousPosition();
    let previousStage: DroneStage = this.stages[this.position];
    previousStage.onStart(data);
    return previousStage;
  }

  //RxJs 좀헛갈리지만 이벤트 중심으로 하려고 한다.
  public pushStage(stage: DroneStage): void{
    stage.nextSubscribe(value=>{this.next(value)});
    stage.previousSubscribe(value=>{this.previous(value)});
    this.stages.push(stage)
  }

  public currentStage(): DroneStage{
    return this.stages[this.position];
  }

  intentSignal(intent: Intent<number>) {
    this.currentStage().intentSignal(intent)
  }



  onCreate(data?: any) {
  }
  public onStart(): void {
    this.currentStage().onDraw();
  }
  onPause(data?: any) {
  }
  onRestart(data?: any) {
  }
  onResume(data?: any) {
  }
  onStop(data?: any) {
  }
  onDestroy(data?: any) {
  }

  // private restore(position: number) {
  //     this.clock.subscribe((x)=>{
  //       this.clockSignal(x)
  //     });
  // }
}

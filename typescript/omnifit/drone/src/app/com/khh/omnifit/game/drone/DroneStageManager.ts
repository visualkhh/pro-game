import {DroneStage} from './stage/DroneStage';
import {DroneStageIntro} from './stage/DroneStageIntro';
import {DroneStageGame} from './stage/DroneStageGame';
import {DroneStageEnd} from './stage/DroneStageEnd';
import {LifeCycle} from '../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';

export class DroneStageManager implements LifeCycle {




  private position: number = 0;
  private stages: Array<DroneStage>;
  private canvas: HTMLCanvasElement;

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
    this.pushStage(new DroneStageIntro(this.canvas));
    this.pushStage(new DroneStageGame(this.canvas,));
    this.pushStage(new DroneStageEnd(this.canvas));
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
  public pushStage(stage: DroneStage): void {
    stage.nextSubscribe(value=>{this.next(value)});
    stage.previousSubscribe(value=>{this.previous(value)});
    this.stages.push(stage);
    stage.onCreate();
  }

  public currentStage(): DroneStage {
    return this.stages[this.position];
  }

  onCreate(data?: any) {}
  public onStart(): void {
    this.currentStage().onStart();
  }
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
  onStop(data?: any) {}
  onDestroy(data?: any) {}

  // private restore(position: number) {
  //     this.clock.subscribe((x)=>{
  //       this.clockSignal(x)
  //     });
  // }
}

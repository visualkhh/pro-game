import {DroneStage} from './stage/DroneStage';
import {DroneStageIntro} from './stage/DroneStageIntro';
import {DroneStageGame} from './stage/DroneStageGame';
import {DroneStageEnd} from './stage/DroneStageEnd';
import {LifeCycle} from '../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {isNullOrUndefined} from 'util';

export class DroneStageManager implements LifeCycle {

  private static instance: DroneStageManager;

  private position = 0;
  private stages: Array<DroneStage> ;

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance() {
    if (!DroneStageManager.instance) {
      DroneStageManager.instance = new DroneStageManager();
    }
    return DroneStageManager.instance;
  }

  private constructor() {
    this.stages = new Array<DroneStage>();
  }

  public nextPosition(): number {
    let p = this.position;
    p++;
    if (p >= this.stages.length) {
      p = this.stages.length - 1;
    }
    return p;
  }
  public previousPosition(): number {
    let p = this.position;
    p--;
    if (p < 0) {
      p = 0;
    }
    return p;
  }

  public nextStage(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.nextPosition();
    const nextStage: DroneStage = this.stages[this.position];
    nextStage.onStart(data);
    return nextStage;

  }
  public previousStage(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.previousPosition();
    const previousStage: DroneStage = this.stages[this.position];
    previousStage.onStart(data);
    return previousStage;
  }

  public pushStage(stage: DroneStage): void {
    this.stages.push(stage);
  }

  public currentStage(): DroneStage {
    return this.stages[this.position];
  }

  onCreate(canvas: HTMLCanvasElement) {
    this.pushStage(new DroneStageIntro(canvas));
    this.pushStage(new DroneStageGame(canvas));
    this.pushStage(new DroneStageEnd(canvas));
    this.stages.forEach(it => it.onCreate());
  }

  onStart(): void { this.currentStage().onStart(); }
  onPause(data?: any) { this.currentStage().onPause(); }
  onRestart(data?: any) { this.currentStage().onRestart(); }
  onResume(data?: any) { this.currentStage().onResume(); }
  onStop(data?: any) { this.currentStage().onStop(); }
  onDestroy(data?: any) {
    this.stages.forEach(it => it.onDestroy());
    this.stages.length = 0;
  }

  // private restore(position: number) {
  //     this.clock.subscribe((x)=>{
  //       this.clockSignal(x)
  //     });
  // }
}

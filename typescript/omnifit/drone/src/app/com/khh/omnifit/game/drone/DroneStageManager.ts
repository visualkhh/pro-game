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

  public goStage(idx: number, data?: any): DroneStage {
    console.log('goStage ' + idx + ' ' + data);
    this.currentStage().onStop(data);
    const nextStage: DroneStage = this.stages[idx];
    nextStage.onStart(data);
    this.position = idx;
    return nextStage;
  }

  public nextStage(data?: any): DroneStage {
    console.log('nextStage ' + this.position + ', ' + data);
    this.currentStage().onStop(data);
    this.position = this.nextPosition();
    const nextStage: DroneStage = this.stages[this.position];
    nextStage.onStart(data);
    return nextStage;
  }

  public previousStage(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.previousPosition();
    console.log('previousStage ' + this.position + ', ' + data);
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

  // onCreate(canvas: HTMLCanvasElement, ... stages: DroneStage[]) {
  onCreate(canvas: HTMLCanvasElement) {
    this.position = 0;
    //this.stages.forEach(it => it.onCreate());
    this.currentStage().onCreate({'data': 'start'});
  }

  onStart(data?: any): void { this.currentStage().onStart(data); }
  onPause(data?: any) { this.currentStage().onPause(data); }
  onRestart(data?: any) { this.currentStage().onRestart(data); }
  onResume(data?: any) { this.currentStage().onResume(data); }
  onStop(data?: any) { this.currentStage().onStop(data); }
  onDestroy(data?: any) {
    this.stages.forEach(it => it.onDestroy(data));
    this.stages.length = 0;
  }

  // private restore(position: number) {
  //     this.clock.subscribe((x)=>{
  //       this.clockSignal(x)
  //     });
  // }
}

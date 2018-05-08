import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';
import {DroneStageIntro} from './DroneStageIntro';
import {DroneStageGame} from './DroneStageGame';
import {DroneStageEnd} from './DroneStageEnd';

export class DroneStageManager {


  private position: number = 0;
  private stages: Array<DroneStage>;
  private canvas: HTMLCanvasElement;
  private clock: Clock;

  constructor(canvas: HTMLCanvasElement) {
    this.stages = new Array<DroneStage>();
    this.canvas= canvas;
    this.init();
  }

  private init() {
    this.clock = new Clock(10);
    this.pushStage(new DroneStageIntro(this.clock, this.canvas));
    this.pushStage(new DroneStageGame(this.clock, this.canvas,));
    this.pushStage(new DroneStageEnd(this.clock, this.canvas));
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

  // private restore(position: number) {
  //     this.clock.subscribe((x)=>{
  //       this.clockSignal(x)
  //     });
  // }
}

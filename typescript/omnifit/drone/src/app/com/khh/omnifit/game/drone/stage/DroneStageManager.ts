import {Stage} from '../../../../stage/Stage';
import {DroneStageGame} from './DroneStageGame';
import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';

export class DroneStageManager {


  private position: number = 0;
  private stages: Array<DroneStage>;

  constructor() {
    this.stages = new Array<DroneStage>();
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


  public next(): DroneStage {
    this.currentStage().onStop();
    this.position = this.nextPosition();
    let nextStage: DroneStage = this.stages[this.position];
    nextStage.onStart();
    return nextStage;

  }
  public previous(): DroneStage {
    this.currentStage().onStop();
    this.position = this.previousPosition();
    let previousStage: DroneStage = this.stages[this.position];
    previousStage.onStart();
    return previousStage;
  }

  //RxJs 좀헛갈리지만 이벤트 중심으로 하려고 한다.
  public pushStage(stage: DroneStage): void{
    stage.nextSubscribe(value=>{this.next()});
    stage.previousSubscribe(value=>{this.previous()});
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

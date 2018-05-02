import {Stage} from '../../../../stage/Stage';
import {DroneStageEnd} from './DroneStageEnd';
import {ClockStage} from '../../../../stage/ClockStage';
import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';

export class DroneStageGame extends DroneStage{


  // constructor(refer: Stage, clock: Clock, canvas: HTMLCanvasElement) {
  //   super(refer, clock, canvas);
  //   this.clock.subscribe((x)=>{
  //     this.clockSignal(x)
  //   });
  // }
  //
  // next(): Stage;
  // next(name: string): Stage;
  // next(name?: string): Stage {
  //   return new DroneStageEnd(this, this.clock, this.canvas);
  // }
  //
  // previous(): Stage;
  // previous(name: string): Stage;
  // previous(name?: string): Stage {
  //   return this.refer;
  // }

  clockSignal(value: number) {
  }

  onDraw(): void {
  }

}

import {Stage} from '../../../../stage/Stage';
import {DroneStageGame} from './DroneStageGame';
import {DroneStageIntro} from './DroneStageIntro';
import {ClockStage} from '../../../../stage/ClockStage';
import {DroneStage} from './DroneStage';

export class DroneStageEnd extends DroneStage{
  clockSignal(value: number) {
  }

  onDraw(): void {
  }
  // next(): Stage;
  // next(name: string): Stage;
  // next(name?: string): Stage {
  //   this.clock.clear();
  //   return new DroneStageIntro(this, this.clock, this.canvas);
  // }
  //
  // previous(): Stage;
  // previous(name: string): Stage;
  // previous(name?: string): Stage {
  //   return this.refer;
  // }
  //
  // clockSignal(value: number) {
  //   this.onDraw();
  // }
  //
  // onDraw(): void {
  //   let context = this.canvas.getContext("2d");
  //   context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   const x = this.canvas.width / 2;
  //   const y = this.canvas.height / 2;
  //   context.font = '30pt Calibri';
  //   context.textAlign = 'center';
  //   context.fillStyle = 'blue';
  //   context.fillText('END', x, y);
  // }

}

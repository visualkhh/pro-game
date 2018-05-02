import {Stage} from '../../../../stage/Stage';
import {DroneStageGame} from './DroneStageGame';
import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';

export class DroneStageIntro extends DroneStage{
  clockSignal(value: number) {
  }

  onDraw(): void {
  }

  //
  // constructor(refer: Stage, clock: Clock, canvas: HTMLCanvasElement) {
  //   super(refer, clock, canvas);
  //   // this.clock.subscribe((x)=>{
  //   //   this.clockSignal(x)
  //   // });
  // }
  // next(): Stage ;
  // next(name: string): Stage;
  // next(name?: string): Stage {
  //   return new DroneStageGame(this, this.clock, this.canvas);
  // }
  //
  // previous(): Stage;
  // previous(name: string): Stage;
  // previous(name?: string): Stage {
  //   return this;
  // }
  //
  // clockSignal(value: number) {
  //   console.log("DroneStageIntro: "+value);
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
  //   context.fillText('Hello World!', x, y);
  // }



}

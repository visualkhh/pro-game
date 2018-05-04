import {Stage} from '../../../../stage/Stage';
import {DroneStageGame} from './DroneStageGame';
import {DroneStageIntro} from './DroneStageIntro';
import {ClockStage} from '../../../../stage/ClockStage';
import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';
import {DroneStageManager} from './DroneStageManager';

export class DroneStageEnd extends DroneStage{

  constructor(clock: Clock, canvas: HTMLCanvasElement) {
    super(clock, canvas);
  }

  mousedown(event: MouseEvent): void {
    console.log({x: event.layerX, y: event.layerY});
    console.log('click END: ' + event.offsetX + '/' + event.offsetY);
    this.previous();
  }
  onDraw(): void {
    console.log("DroneStageEnd onDraw");
      let context = this.canvas.getContext("2d");
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const x = this.canvas.width / 2;
      const y = this.canvas.height / 2;
      context.font = '30pt Calibri';
      context.textAlign = 'center';
      context.fillStyle = 'blue';
      context.fillText('END', x, y);
  }


}

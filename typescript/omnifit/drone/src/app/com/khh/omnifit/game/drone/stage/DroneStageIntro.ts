import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';

export class DroneStageIntro extends DroneStage{

  constructor(clock: Clock, canvas: HTMLCanvasElement) {
    super(clock, canvas);
  }

  mousedown(event: MouseEvent): void {
    console.log({x: event.layerX, y: event.layerY});
    console.log('click Intro: ' + event.offsetX + '/' + event.offsetY);
    this.next();
  }

  onDraw(): void {
    console.log("DroneStageIntro onDraw");
    let context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    context.font = '30pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'blue';
    context.fillText('60초동안 집중력을 발휘하여', x, y);
    context.fillText('드론을 높게 뛰어봅시다.', x, y+50);
    context.fillText('(시작하기)', x, y+50+50);
  }

}

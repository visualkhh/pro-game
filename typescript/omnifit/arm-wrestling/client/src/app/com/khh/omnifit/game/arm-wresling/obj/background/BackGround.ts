import {AWStage} from '../../stage/AWStage';
import {AWObj} from '../AWObj';

// import { Point } from '../org/Point';
export class BackGround extends AWObj {

  private currentX = 0;

  constructor(stage: AWStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.rect(0, 0, this.stage.width, this.stage.height);
    const grd = context.createLinearGradient(this.stage.width / 2, 0, this.stage.width / 2, this.stage.height);
    grd.addColorStop(0, '#031f30');
    grd.addColorStop(0.1, '#032d45');
    grd.addColorStop(0.4, '#8D7BB7');
    grd.addColorStop(0.8, '#f294ae');
    grd.addColorStop(1, '#fed3e6');

    // context.fillStyle = grd;
    context.fillStyle = '#000000';
    context.fill();
  }

  onCreate(data?: any) {
  }

  onDestroy(data?: any) {
  }

  onPause(data?: any) {
  }

  onRestart(data?: any) {
  }

  onResume(data?: any) {
  }

  onStart(data?: any) {
  }

  onStop(data?: any) {
  }

}

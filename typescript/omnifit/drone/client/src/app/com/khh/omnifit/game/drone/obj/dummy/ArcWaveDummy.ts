import {ObjDrone} from '../ObjDrone';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {DroneStage} from '../../stage/DroneStage';

export class ArcWaveDummy extends ObjDrone {
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private angle: PointVector;
  private amplitude: PointVector;



  constructor(stage: DroneStage, x: number, y: number, z: number) {
    super(stage, x, y, z);
  }

  onStart() {
    this.angle = new PointVector();
    this.velocity = new PointVector(RandomUtil.random(-0.05, 0.05), RandomUtil.random(-0.05, 0.05));
    this.amplitude = new PointVector(RandomUtil.random(20, this.stage.width / 2), RandomUtil.random(20, this.stage.height / 2));
  }


  onDraw(context: CanvasRenderingContext2D): void {
    this.oscillate();
    const x = Math.sin(this.angle.x) * this.amplitude.x;
    const y = Math.sin(this.angle.y) * this.amplitude.y;

    context.beginPath();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.strokeStyle = '#FFFF00';
    context.lineWidth = 2;
    context.translate(this.stage.width / 2, this.stage.height / 2);
    context.moveTo(0, 0);
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.arc(x, y, 32, 0, 2 * Math.PI);
    context.fill();
  }


  oscillate() {
    this.angle.add(this.velocity);
  }

  onStop() {}
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}




}

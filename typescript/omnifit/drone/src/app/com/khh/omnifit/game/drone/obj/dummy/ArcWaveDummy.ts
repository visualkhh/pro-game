import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {PointVector} from '../../../../../math/PointVector';
import {RandomUtil} from '../../../../../math/RandomUtil';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';

export class ArcWaveDummy extends ObjDrone {
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private angle: PointVector;
  private amplitude: PointVector;



  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.onStart();
  }



  onStart() {
    super.onStart();
    this.angle = new PointVector();
    this.velocity = new PointVector(RandomUtil.random(-0.05, 0.05), RandomUtil.random(-0.05, 0.05));
    this.amplitude = new PointVector(RandomUtil.random(20, this.canvas.width/2), RandomUtil.random(20, this.canvas.height/2));
  }



  onDraw(): void {
    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');


    this.oscillate();
    var x = Math.sin(this.angle.x) * this.amplitude.x;
    var y = Math.sin(this.angle.y) * this.amplitude.y;


    context.beginPath();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.strokeStyle = "#FFFF00";
    context.lineWidth = 2;
    context.translate(this.canvas.width/2, this.canvas.height/2);
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



  onStop() {
    super.onStop();
    console.log('Mouse onStop');
  }

  intentSignal(intent: Intent<GameData>) {
  }



}

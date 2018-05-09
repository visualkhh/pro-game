import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../../../../../lib-typescript/com/khh/data/Intent';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';

// import { Point } from '../org/Point';
export class Wind extends ObjDrone {

  private beforeIntent: Intent<GameData>;
  private intent: Intent<GameData>;


  constructor(stage: DroneStage,x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';

    this.onStart();
  }


  onStart() {
    super.onStart();
  }

  onDraw(): void {

    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');

    context.setTransform(1, 0, 0, 1, 0, 0);
    if (this.beforeIntent && this.intent) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.beginPath()
      context.fillStyle = '#442266'
      context.font = '30pt Calibri';
      context.textAlign = 'left';
      context.textBaseline="bottom";
      context.fillText('wind:' + this.intent.data.wind, 50, this.canvas.height);
    }


  }

  clockSignal(value?: any) {
    this.onDraw();
  }


  onStop() {
    super.onStop();
    console.log('Score onStop');
  }

  intentSignal(intent: Intent<GameData>) {
    if (!this.beforeIntent) {
      this.beforeIntent = intent;
      this.intent = intent;
    } else {
      this.beforeIntent = this.intent;
      this.intent = intent;
    }
  }
}

import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
import {Rect} from '../../../../../graphics/Rect';
import {PointVector} from '../../../../../math/PointVector';
import {RandomUtil} from '../../../../../math/RandomUtil';
export class Score extends ObjDrone {

  private beforeIntent: Intent<number>;
  private intent: Intent<number>;



  constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(x, y, z, canvas);
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
    if (this.beforeIntent && this.intent){
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.font = '30pt Calibri';
      context.textAlign = 'left';
      context.fillText('con(' + this.intent.name + '):' + this.intent.data + ' ['+(this.intent.data-this.beforeIntent.data)+']', 50, 50);
    }


  }

  clockSignal(value?: any) {
    this.onDraw();
  }


  onStop() {
    super.onStop();
    console.log('Score onStop');
  }

  intentSignal(intent: Intent<number>) {
    if (!this.beforeIntent){
      this.beforeIntent = intent;
      this.intent = intent;
    }else{
      this.beforeIntent = this.intent;
      this.intent = intent;
    }
  }
}

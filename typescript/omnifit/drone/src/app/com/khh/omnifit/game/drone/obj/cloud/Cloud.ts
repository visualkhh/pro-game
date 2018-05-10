import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../../../../../lib-typescript/com/khh/data/Intent';
import {DroneStage} from '../../stage/DroneStage';

// import { Point } from '../org/Point';
export class Cloud extends ObjDrone {

  private maxX = 50;
  private currentX = 0;
  private beforeWind = 0;
  private wind = 0;

  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/cloud.png';
  }


  onDraw(): void {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;

    if (this.beforeWind - this.wind > 0){
      this.currentX += 0.1;
    }else if (this.beforeWind - this.wind < 0){
      this.currentX -= 0.1;
    }


    const ctxBuffer: CanvasRenderingContext2D = this.canvas.getContext('2d');
    ctxBuffer.drawImage(this.img, (x - this.img.width / 2)  + this.currentX, 0);
  }

  clockSignal(value?: any) {
    this.onDraw();
  }

  // intentSignal(intent: Intent<GameData>) {
  //   if (this.beforeWind != intent.data.wind.x){
  //     this.beforeWind = intent.data.wind.x;
  //   }else{
  //     this.wind = intent.data.wind.x;
  //   }
  // }
}

import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import {ObjImg} from 'app/com/khh/graphics/ObjImg';
import {Rect} from 'app/com/khh/graphics/Rect';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';
// import { Point } from '../org/Point';
export class Cloud extends ObjDrone{

  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = "assets/image/cloud.png";
  }


  onDraw(): void {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    let ctxBuffer: CanvasRenderingContext2D = this.canvas.getContext("2d");
    ctxBuffer.drawImage(this.img,x - this.img.width/2, 0);
  }

  clockSignal(value?: any) {
    this.onDraw();
  }

  intentSignal(intent: Intent<GameData>) {
  }

}

import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import {ObjImg} from 'app/com/khh/graphics/ObjImg';
import {Rect} from 'app/com/khh/graphics/Rect';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {GameData} from '../../vo/GameData';
// import { Point } from '../org/Point';
export class Ground extends ObjDrone{


  constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(x, y, z, canvas);
    this.img = new Image();
    this.img.src = "assets/image/ground.png";
  }

  onDraw(): void {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    let context: CanvasRenderingContext2D = this.canvas.getContext("2d");
    context.drawImage(this.img,x - this.img.width/2, this.canvas.height -  this.img.height);
  }

  clockSignal(value?: any) {
    this.onDraw();
  }
  intentSignal(intent: Intent<GameData>) {
  }

}

import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import {ObjImg} from 'app/com/khh/graphics/ObjImg';
import {Rect} from 'app/com/khh/graphics/Rect';
// import { Point } from '../org/Point';
export class Ground extends ObjImg{

  onDraw(): void {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    let ctxBuffer: CanvasRenderingContext2D = this.canvas.getContext("2d");
    ctxBuffer.drawImage(this.img,x - this.img.width/2, this.canvas.height -  this.img.height);
  }

  clockSignal(value?: any) {
    this.onDraw();
  }

}

import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/domain/obj/Obj';
import {ObjImg} from '../ObjImg';
import {Rect} from '../../../graphics/Rect';
// import { Point } from '../org/Point';
export class Drone extends ObjImg{


  constructor() {
    super();
  }

  onDraw(canvas: HTMLCanvasElement): void {
  }

}

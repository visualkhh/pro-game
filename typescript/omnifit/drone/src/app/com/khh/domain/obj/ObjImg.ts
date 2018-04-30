import { Observable } from 'rxjs/Observable';
import { Obj } from 'app/com/khh/domain/obj/Obj';
import { Rect } from 'app/com/khh/graphics/Rect';
export abstract class ObjImg extends Obj{

  img : HTMLImageElement;
  abstract onDraw(drawSpace: Rect, context: CanvasRenderingContext2D) : void;
}

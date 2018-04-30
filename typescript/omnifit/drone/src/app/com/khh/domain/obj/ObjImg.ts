import { Observable } from 'rxjs/Observable';
import { Obj } from 'app/com/khh/domain/obj/Obj';
import { Rect } from 'app/com/khh/graphics/Rect';
export abstract class ObjImg extends Obj{

  private img : HTMLImageElement;



  public setImg(img : HTMLImageElement): void{
    this.img = img;
  }


  abstract onDraw(canvas: HTMLCanvasElement) : void;



}

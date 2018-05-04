import { Observable } from 'rxjs/Observable';
import { Obj } from 'app/com/khh/obj/Obj';
import { Rect } from 'app/com/khh/graphics/Rect';
import {Point} from './Point';
export abstract class ObjImg extends Obj{



  private _img : HTMLImageElement;
  private _head: Point;
  private _canvas: HTMLCanvasElement;


  // = new Point(img.width/2,img.height/2,0),
  constructor(x: number = 0, y: number = 0, z: number = 0, canvas?: HTMLCanvasElement, img?: HTMLImageElement, head?: Point) {
    super(x, y, z);
    this._canvas = canvas;
    this._img = img;
    this._head = head;
  }


  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }


  get img(): HTMLImageElement {
    return this._img;
  }

  set img(value: HTMLImageElement) {
    this._img = value;
  }

  get head(): Point {
    return this._head;
  }

  set head(value: Point) {
    this._head = value;
  }

  public setImg(img : HTMLImageElement): void{
    this._img = img;
  }


  abstract onDraw() : void;
  abstract clockSignal(value?: any);
}

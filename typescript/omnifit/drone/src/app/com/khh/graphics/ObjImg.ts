import {Point} from './Point';
import {Obj} from '../obj/Obj';

export abstract class ObjImg extends Obj{



  private _img: HTMLImageElement;
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

  public getImgCenterY() {
    return this.img.height / 2;
  }

  public getImgCenterX() {
    return this.img.width / 2;
  }

  public getCanvasCenterY() {
    return this.canvas.height / 2;
  }

  public getCanvasCenterX() {
    return this.canvas.width / 2;
  }

  abstract onDraw() : void;
  abstract clockSignal(value?: any);
}

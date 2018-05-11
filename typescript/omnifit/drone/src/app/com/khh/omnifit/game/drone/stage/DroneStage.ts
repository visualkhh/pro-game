import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ObjDrone} from '../obj/ObjDrone';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {Stage} from '../../../../../../../../lib-typescript/com/khh/stage/Stage';
import {interval} from 'rxjs/observable/interval';
import {ViewInterface} from '../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';
import {isNullOrUndefined} from 'util';

export abstract class DroneStage extends Stage implements LifeCycle, ViewInterface {


  public static readonly EVENT_CLOCK = 'CLOCK';

  // private nextSource;
  // private nextObserver:Subscriber<any>;
  // private previousSource;
  // private previousObserver:Subscriber<any>;
  private _objs: Array<ObjDrone>;
  private clock: Observable<Date>;
  protected clockInterval = 5;
  private _canvas: HTMLCanvasElement;
  private _bufferCanvas: HTMLCanvasElement;


  constructor(canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super();
    this._canvas = canvas;
    this._objs = objs;
    this._bufferCanvas = document.createElement('canvas');
    this._bufferCanvas.width = this._canvas.width;
    this._bufferCanvas.height = this._canvas.height;
    this.width = this._canvas.width;
    this.height = this._canvas.height;

   //////////////event
    //http://xgrommx.github.io/rx-book/content/observable/observable_methods/fromeventpattern.html
    // Observable.fromEvent(this._canvas, 'load').subscribe((event: Event) => {
    //   this.height = event.srcElement.clientWidth;
    //   this.width = event.srcElement.clientHeight;
    //   this._bufferCanvas.dispatchEvent(event);
    // });
    // Observable.fromEvent(this._canvas, 'mousedown').subscribe((event: MouseEvent) => {
    //   console.log('down');
    //   this._bufferCanvas.dispatchEvent(event);
    // });
    // Observable.fromEvent(this._canvas, 'keydown').subscribe((event: MouseEvent) => this._bufferCanvas.dispatchEvent(event));
    // Observable.fromEvent(this._canvas, 'mousemove').subscribe((event: MouseEvent) => {
      // console.log('mousemove ' + event);
      // this._bufferCanvas.dispatchEvent(event);
    // });
    Observable.fromEvent(this._canvas, 'resize').subscribe((event: Event) => {
      this.height = event.srcElement.clientHeight;
      this.width = event.srcElement.clientWidth;
      this._bufferCanvas.width = this.width;
      this._bufferCanvas.height = this.height;
      // this._bufferCanvas.dispatchEvent(event);
    });
    // Observable.fromEvent(this.canvas, 'mouseup').subscribe((event: MouseEvent)=>{
    //   if(this.manager)this.manager.mouseup(event);
    // });
    // Observable.fromEvent(this.canvas, 'mousemove').subscribe((event: MouseEvent)=>{
    //   if(this.manager)this.manager.mousemove(event);
    // });
    // Observable.fromEvent(this.canvas, 'keydown').subscribe((event: KeyboardEvent)=>{
    //   if(this.manager)this.manager.keydown(event);
    // });
    // Observable.fromEvent(this.canvas, 'keyup').subscribe((event: KeyboardEvent)=>{
    //   if(this.manager)this.manager.keyup(event);
    // });
    //
  }



  // get canvas(): HTMLCanvasElement {
  //   return this._canvas;
  // }

  getCurrentCanvas(): HTMLCanvasElement {
    return this._bufferCanvas;
  }
  get bufferCanvas(): HTMLCanvasElement {
    return this._bufferCanvas;
  }

  flushBufferToCanvas() {
    const context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(this._bufferCanvas, 0, 0);
  }
  flushCanvas(canvas: HTMLCanvasElement) {
    const context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(canvas, 0, 0);
  }

  objPush(obj: ObjDrone| Array<ObjDrone>) {
    if (obj instanceof Array) {
      obj.forEach(it => this.objs.push(it));
    }else {
      this.objs.push(obj);
    }
  }



  get objs(): Array<ObjDrone> {
    return this._objs.sort((n1, n2) => (n1.z > n2.z ? 1 : -1));
  }

// public nextStage(data?: any): void {
  //   return this.nextObserver.next(data) ;
  // }
  // public previousStage(data?: any): void {
  //   return this.previousObserver.next(data);
  // }


  // public nextSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
  //   return this.nextSource.subscribe(next, error, completed);
  // }
  // public previousSubscribe(next: (value: any)=>void, error?: (value: any)=>void, completed?: (value: any)=>void): Subscription {
  //   return this.previousSource.subscribe(next, error, completed);
  // }


  abstract onDraw(): void;

  protected clockSubscribe(next: (value: Date) => void): Subscription {
    if (isNullOrUndefined(this.clock)) {
      this.clock = interval(this.clockInterval).map(_ => new Date());
    }
    return this.clock.subscribe(next);
  }
  canvasSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return Observable.fromEvent(this._canvas, eventName).subscribe(next);
  }
  abstract eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription ;

  // public subscribe(observableName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
  //   if (this[observableName]) {
  //   return this[observableName].subscribe(next, error, complete);
  //   }
  // }

  //LifeCycle
  // onCreate(data?: any) {
  //   this.clock = interval(this.clockInterval).map(_ => new Date());
  //   this.objs.forEach(it => it.onCreate(data));
  // }
  abstract onCreate(data?: any);
  abstract onDestroy(data?: any);
  abstract onPause(data?: any);
  abstract onRestart(data?: any);
  abstract onResume(data?: any);
  abstract onStart(data?: any);

  abstract onStop(data?: any);


  // onStart(data?: any) {this.objs.forEach(it => it.onStart(data)); }
  // onResume(data?: any) {this.objs.forEach(it => it.onResume(data)); }
  // onRestart(data?: any) {this.objs.forEach(it => it.onRestart(data)); }
  // onStop(data?: any) {this.objs.forEach(it => it.onStop(data)); }
  // onPause(data?: any) {this.objs.forEach(it => it.onPause(data)); }
  // onDestroy(data?: any) {this.objs.forEach(it => it.onDestroy(data)); }
}

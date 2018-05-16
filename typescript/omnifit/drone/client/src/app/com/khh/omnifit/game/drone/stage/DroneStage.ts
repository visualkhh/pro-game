import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {LifeCycle} from '../../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {ViewInterface} from '../../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';
import {Stage} from '../../../../../../../../../lib-typescript/com/khh/stage/Stage';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ObjDrone} from '../obj/ObjDrone';

export abstract class DroneStage extends Stage implements LifeCycle, ViewInterface {

  public static readonly EVENT_CLOCK = 'CLOCK';

  private _objs: ObjDrone[];
  private clock: Observable<number>;
  protected clockInterval = 100;
  private _canvas: HTMLCanvasElement;
  private _bufferCanvas: HTMLCanvasElement;

  //http://xgrommx.github.io/rx-book/content/observable/observable_methods/fromeventpattern.html
  constructor(canvas: HTMLCanvasElement, objs: ObjDrone[] = new Array<ObjDrone>()) {
    super();
    this._canvas = canvas;
    this._objs = objs;
    this._bufferCanvas = document.createElement('canvas');
    this._bufferCanvas.width = this._canvas.width;
    this._bufferCanvas.height = this._canvas.height;
    this.width = this._canvas.width;
    this.height = this._canvas.height;

    ////////////event
    Observable.fromEvent(this._canvas, 'resize').subscribe((event: Event) => {
      this.height = event.srcElement.clientHeight;
      this.width = event.srcElement.clientWidth;
      this._bufferCanvas.width = this.width;
      this._bufferCanvas.height = this.height;
    });
  }

  get bufferCanvas(): HTMLCanvasElement {
    return this._bufferCanvas;
  }

  flushBufferToCanvas() {
    this.flushCanvas(this._bufferCanvas);
  }
  flushCanvas(canvas: HTMLCanvasElement) {
    const context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(canvas, 0, 0);
  }

  objPush(obj: ObjDrone| ObjDrone[]) {
    if (obj instanceof Array) {
      obj.forEach((it) => this.objs.push(it));
    }else {
      this.objs.push(obj);
    }
  }

  get objs(): ObjDrone[] {
    return this._objs.sort((n1, n2) => (n1.z > n2.z ? 1 : -1));
  }

  abstract onDraw(): void;

  protected clockIntervalSubscribe(next: (value: number) => void): Subscription {
    if (ValidUtil.isNullOrUndefined(this.clock)) {
      this.clock = interval(this.clockInterval);
    }
    return this.clock.subscribe(next);
  }
  canvasEventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return Observable.fromEvent(this._canvas, eventName).subscribe(next);
  }
  abstract eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription;

  abstract onCreate(data?: any);
  abstract onDestroy(data?: any);
  abstract onPause(data?: any);
  abstract onRestart(data?: any);
  abstract onResume(data?: any);
  abstract onStart(data?: any);
  abstract onStop(data?: any);

}

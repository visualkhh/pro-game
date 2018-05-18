import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {CollectionUtil} from '../../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {LifeCycle} from '../../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {ViewInterface} from '../../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';
import {Stage} from '../../../../../../../../../lib-typescript/com/khh/stage/Stage';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStageManager} from '../DroneStageManager';
import {ObjDrone} from '../obj/ObjDrone';
import {DroneResourceManager} from '../DroneResourceManager';
import {Drone} from '../obj/drone/Drone';
import {Obj} from '../../../../../../../../../lib-typescript/com/khh/obj/Obj';

export abstract class DroneStage extends Stage implements LifeCycle, ViewInterface {

  public static readonly EVENT_CLOCK = 'CLOCK';

  private _objs: ObjDrone[];
  private clock: Observable<number>;
  protected clockInterval = 10;
  private _canvas: HTMLCanvasElement;
  private _bufferCanvas: HTMLCanvasElement;
  private reSizeSubscription: Subscription;

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
    this.reSizeSubscription = Observable.fromEvent(this._canvas, 'resize').subscribe((event: Event) => {
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
  flushCanvas(canvas: HTMLCanvasElement = this._bufferCanvas) {
    const context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(canvas, 0, 0);
  }

  pushObj(obj: ObjDrone| ObjDrone[]) {
    if (obj instanceof Array) {
      obj.forEach((it) => this.objs.push(it));
    }else {
      this.objs.push(obj);
    }
  }

  get objs(): ObjDrone[] {
    return this._objs.sort((n1, n2) => (n1.z > n2.z ? 1 : -1));
  }
  get objsAll(): ObjDrone[] {
    return this._objs.concat(DroneStageManager.getInstance().objs).sort((n1, n2) => (n1.z > n2.z ? 1 : -1));
  }
  drawObjsAndFlush(context: CanvasRenderingContext2D, canvas?: HTMLCanvasElement): void {
    this.objs.forEach((it) => it.onDraw(context));
    this.flushCanvas(canvas);
  }
  drawObjsAllAndFlush(context: CanvasRenderingContext2D, canvas?: HTMLCanvasElement): void {
    this.objsAll.forEach((it) => it.onDraw(context));
    this.flushCanvas(canvas);
  }
  removeObjOnStopDestory(obj: ObjDrone): void {
     CollectionUtil.deleteArrayItem(this._objs, obj, (it) => {
       it.onStop();
       it.onDestroy();
     });
  }
  addObjCreateStart(obj: ObjDrone): ObjDrone {
    obj.onCreate();
    obj.onStart();
    this.pushObj(obj);
    return obj;
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

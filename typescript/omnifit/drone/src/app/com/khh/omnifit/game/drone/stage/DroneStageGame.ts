import {DroneStage} from './DroneStage';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {interval} from 'rxjs/observable/interval';
import {RandomUtil} from '../../../../../../../../lib-typescript/com/khh/math/RandomUtil';
import {PointVector} from '../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {DroneStageManager} from '../DroneStageManager';
import {isNullOrUndefined} from 'util';

//공기 및 유체 저항
//https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/air-and-fluid-resistance
export class DroneStageGame extends DroneStage {

  public static readonly EVENT_WIND = 'WIND';
  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;
  private eventSubscribes: Map<string, Observable<any>>;
  private clockSubscription: Subscription;
  private wind = new PointVector();
  private windIntervalSubscription: Subscription;

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    const x = this.width / 2;
    const y = this.height / 2;

    context.font = '30pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'pink';
    context.fillRect(0, 0, this.width, this.height);
    context.fillStyle = 'blue';
    context.fillText('********GAME********', x, y);

    //objs draw
    this.objs.forEach(it => it.onDraw(context));
    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach(it => it.onCreate(data));
  }
  onStart(data?: any): void {

    const windObservable = interval(50).map( n => this.wind);
    this.eventSubscribes = new Map<string, Observable<any>>();
    this.eventSubscribes.set(DroneStageGame.EVENT_WIND, windObservable);

    this.objs.forEach(it => it.onStart());
    this.onDraw();
    this.windIntervalSubscription = interval(50).subscribe( n => this.wind = this.createRandomWind());
    this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.resizeSubscription = this.canvasEventSubscribe('resize', (event: Event) => this.onDraw());
    this.mouseDownSubscription = this.canvasEventSubscribe('mousedown', (event: MouseEvent) => DroneStageManager.getInstance().nextStage());
  }

  onStop(data?: any): void {
    this.objs.forEach(it => it.onStop(data));
    if (!isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.mouseDownSubscription)) { this.mouseDownSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.windIntervalSubscription)) { this.windIntervalSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
  }

  private createRandomWind(): PointVector {
    return new PointVector(Math.floor(RandomUtil.random((this.width / 3) * -1, this.width / 3)));
  }

  eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.eventSubscribes.get(eventName).subscribe(next, error, complete);
  }

  onDestroy(data?: any) {
    this.objs.forEach(it => it.onDestroy(data));
  }

  onPause(data?: any) {
    this.objs.forEach(it => it.onPause(data));
  }

  onRestart(data?: any) {
    this.objs.forEach(it => it.onRestart(data));
  }

  onResume(data?: any) {
    this.objs.forEach(it => it.onResume(data));
  }
}

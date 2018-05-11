import {DroneStage} from './DroneStage';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ObjDrone} from '../obj/ObjDrone';
import {isNullOrUndefined} from 'util';
import {DroneStageManager} from '../DroneStageManager';

export class DroneStageIntro extends DroneStage {

  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;

  constructor(canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super(canvas, objs);
  }

  // mousedown(event: MouseEvent): void {
  //   console.log({x: event.layerX, y: event.layerY});
  //   console.log('click Intro: ' + event.offsetX + '/' + event.offsetY);
  //   this.next();
  // }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    console.log('DroneStageIntro onDraw');
    context.clearRect(0, 0, this.width, this.height);
    const x = this.width / 2;
    const y = this.height / 2;
    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'blue';
    context.fillText('60초동안 집중력을 발휘하여', x, y);
    context.fillText('드론을 높게 뛰어봅시다.', x, y + 15);
    context.fillText('(시작하기)', x, y + 30);

    //objs draw
    this.objs.forEach(it => it.onDraw(context));

    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach(it => it.onCreate(data));
  }

  onStart(data?: any): void {
    console.log('intro onStart');
    this.onDraw();
    this.resizeSubscription = this.canvasSubscribe('resize', (evnet: Event) => {
      this.onDraw();
    });
    this.mouseDownSubscription = this.canvasSubscribe('mousedown', (event: MouseEvent) => DroneStageManager.getInstance().nextStage());
    this.objs.forEach(it => it.onStart(data));
  }

  onStop(data?: any): void {
    console.log('intro onStop');
    if (!isNullOrUndefined(this.resizeSubscription)) { this.resizeSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.mouseDownSubscription)) { this.mouseDownSubscription.unsubscribe(); }
  }

  eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return undefined;
  }
  onResume(data?: any) {this.objs.forEach(it => it.onResume(data)); }
  onRestart(data?: any) {this.objs.forEach(it => it.onRestart(data)); }
  onPause(data?: any) {this.objs.forEach(it => it.onPause(data)); }
  onDestroy(data?: any) {this.objs.forEach(it => it.onDestroy(data)); }
}

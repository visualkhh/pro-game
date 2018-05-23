import {Subscription} from 'rxjs/Subscription';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStageManager} from '../DroneStageManager';
import {ObjDrone} from '../obj/ObjDrone';
import {DroneStage} from './DroneStage';

//websocket https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/
export class DroneStageIntro extends DroneStage {

  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;
  private clockSubscription: Subscription;
  private websocketSubscription: Subscription;

  constructor(canvas: HTMLCanvasElement, objs?: ObjDrone[]) {
    super(canvas, objs);
    this.clockInterval = 10;
  }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);

    const x = this.width / 2;
    const y = this.height / 2;
    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'blue';
    context.fillText('60초동안 집중력을 발휘하여', x, y);
    context.fillText('드론을 높게 띄어봅시다.', x, y + 15);
    context.fillText('(시작하기)(' + WebSocket.CLOSED + ', ' + WebSocket.OPEN + '(open), ' + WebSocket.CLOSING + ', ' + WebSocket.CONNECTING + ')' + DroneStageManager.getInstance().webSocket.readyState, x, y + 30);

    //objs draw
    DroneStageManager.getInstance().getAllObjs(this).forEach( (it) => {
      it.onDraw(context);
    });
    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach((it) => it.onCreate(data));
  }

  onStart(data?: any): void {

    this.websocketSubscription = DroneStageManager.getInstance().webSocketSubject.filter((telegram) => telegram.action === 'welcome').subscribe((telegram) => {
      console.log('telegram Intro ' + telegram);
    });

    console.log('intro onStart');
    this.onDraw();
    this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.resizeSubscription = this.canvasEventSubscribe('resize', (evnet: Event) => this.onDraw());
    this.mouseDownSubscription = this.canvasEventSubscribe('mousedown', (event: MouseEvent) => DroneStageManager.getInstance().nextStage());
    this.objs.forEach((it) => it.onStart(data));
  }

  onStop(data?: any): void {
    console.log('intro onStop');
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) { this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.mouseDownSubscription)) { this.mouseDownSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.websocketSubscription)) { this.websocketSubscription.unsubscribe(); }
  }

  eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return undefined;
  }
  onResume(data?: any) {this.objs.forEach((it) => it.onResume(data)); }
  onRestart(data?: any) {this.objs.forEach((it) => it.onRestart(data)); }
  onPause(data?: any) {this.objs.forEach((it) => it.onPause(data)); }
  onDestroy(data?: any) {this.objs.forEach((it) => it.onDestroy(data)); }
}

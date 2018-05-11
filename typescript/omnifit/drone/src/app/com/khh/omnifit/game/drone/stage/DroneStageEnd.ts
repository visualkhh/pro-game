import {DroneStage} from './DroneStage';
import {Subscription} from 'rxjs/Subscription';
import {ObjDrone} from '../obj/ObjDrone';
import {isNullOrUndefined} from 'util';
import {DroneStageManager} from '../DroneStageManager';

export class DroneStageEnd extends DroneStage {

  private previousStageData: any | undefined;
  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;
  constructor(canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super(canvas, objs);
  }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    console.log('DroneStageEnd onDraw');
    context.clearRect(0, 0, this.width, this.height);
    const x = this.width / 2;
    const y = this.height / 2;
    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'blue';
    context.fillText('END (' + this.previousStageData + ' 점)', x, y);
    context.fillText('(다시 시작하기)', x, y + 50);
    this.flushBufferToCanvas();
  }


  onCreate(data?: any): void {

  }
  onStart(data?: any): void {
    this.previousStageData = data;
    this.onDraw();
    this.resizeSubscription = this.canvasSubscribe('resize', _ => this.onDraw());
    this.mouseDownSubscription = this.canvasSubscribe('mousedown', (event: MouseEvent) => {
      console.log({x: event.layerX, y: event.layerY});
      console.log('click END: ' + event.offsetX + '/' + event.offsetY);
      DroneStageManager.getInstance().previousStage();
    });
  }


  onStop(data?: any): void {
    if (isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (isNullOrUndefined(this.mouseDownSubscription)) {this.mouseDownSubscription.unsubscribe(); }
  }

  onDestroy(data?: any) {
  }

  onPause(data?: any) {
  }

  onRestart(data?: any) {
  }

  onResume(data?: any) {
  }


  eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return undefined;
  }
}

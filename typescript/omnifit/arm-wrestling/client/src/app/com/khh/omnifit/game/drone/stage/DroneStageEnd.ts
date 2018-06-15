import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStageManager} from '../DroneStageManager';
import {ObjDrone} from '../obj/ObjDrone';
import {DroneStage} from './DroneStage';
import {Room} from '../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';

export class DroneStageEnd extends DroneStage {

  private previousStageData: Room<any>;
  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;
  constructor(canvas: HTMLCanvasElement, objs: ObjDrone[] = new Array<ObjDrone>()) {
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

  onCreate(data?: any): void {}
  onStart(data?: any): void {
    this.previousStageData = data;
    this.onDraw();
    this.mouseDownSubscription = this.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      console.log({x: event.layerX, y: event.layerY});
      console.log('click END: ' + event.offsetX + '/' + event.offsetY);
      DroneStageManager.getInstance().goStage(0);
    });
  }

  onStop(data?: any): void {
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.mouseDownSubscription)) {this.mouseDownSubscription.unsubscribe(); }
  }

  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
  eventObservable(eventName: string): Observable<any> {
    return undefined;
  }

}

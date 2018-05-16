import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStageManager} from '../../DroneStageManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {Telegram} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';

export class Score extends ObjDrone {

  private pointSubscription: Subscription;
  private point: number;
  private timeSecond: number;
  private resizeSubscription: Subscription;
  private concentrationSubscription: Subscription;
  private keySubscription: Subscription;
  private beforeHeadsetConcentration = 0;
  private headsetConcentration = 0;
  constructor(stage: DroneStage, x: number, y: number, z: number) {
    super(stage, x, y, z);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.beginPath();
    context.fillStyle = '#FF0000';
    context.font = '10pt Calibri';
    context.textAlign = 'left';
    context.fillText('con:' + this.headsetConcentration + ' [' + (this.headsetConcentration - this.beforeHeadsetConcentration) + ']', 50, 50);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.beginPath();
    context.fillText('time(' + this.timeSecond + ') point(' + this.point + ')', 50, 60);
  }

  onStart(data?: any) {
    this.point = 0;
    this.timeSecond = 5;
    this.pointSubscription = interval(1000).subscribe((it) => {
      this.timeSecond--;
      console.log('timeSecond' + this.timeSecond);
      if (this.timeSecond <= 0) {
        DroneStageManager.getInstance().nextStage(this.point);
      }
    });
    //key
    this.keySubscription = DeviceManager.getInstance().fromeEvent('keydown', (e: KeyboardEvent) => {
      let at = this.headsetConcentration;
      if ('ArrowUp' === e.key) {
        at++;
      }else if ('ArrowDown' === e.key) {
        at--;
      }
      DeviceManager.getInstance().dispatchCustomEvent(new CustomEvent(DeviceManager.EVENT_OMNIFIT_HEADSET_CONCENTRATION, {detail: at}));
    });
    //집중도
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration;
      this.point += Number(concentration);
      if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
        DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {score: this.point}));
      }
    });
  }

  onStop(data: any) {
    if (!ValidUtil.isNullOrUndefined(this.pointSubscription)) {this.pointSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.keySubscription)) {this.keySubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

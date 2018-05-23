import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStageManager} from '../../DroneStageManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class Score extends ObjDrone {

  private pointSubscription: Subscription;
  private rollingSubscription: Subscription;
  private point: number;
  private timeSecond: number;
  private resizeSubscription: Subscription;
  private concentrationSubscription: Subscription;
  private keySubscription: Subscription;
  private beforeHeadsetConcentration = 0;
  private headsetConcentration = 0;
  private finishCnt = 3;

  constructor(stage: DroneStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
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

    if (this.finishCnt > 0 && this.headsetConcentration <= 0) {
      this.img = DroneResourceManager.getInstance().resources('gage_00Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 1) {
      this.img = DroneResourceManager.getInstance().resources('gage_01Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 2) {
      this.img = DroneResourceManager.getInstance().resources('gage_02Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 3) {
      this.img = DroneResourceManager.getInstance().resources('gage_03Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 4) {
      this.img = DroneResourceManager.getInstance().resources('gage_04Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 5) {
      this.img = DroneResourceManager.getInstance().resources('gage_05Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 6) {
      this.img = DroneResourceManager.getInstance().resources('gage_06Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 7) {
      this.img = DroneResourceManager.getInstance().resources('gage_07Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration === 8) {
      this.img = DroneResourceManager.getInstance().resources('gage_08Img');
    }else if (this.finishCnt > 0 && this.headsetConcentration >= 9) {
      this.img = DroneResourceManager.getInstance().resources('gage_09Img');
    }
    context.drawImage(this.img, 20, 20);
  }

  onStart(data?: any) {
    this.point = 0;
    this.timeSecond = 60;
    this.finishCnt = 3;
    this.pointSubscription = interval(1000).subscribe((it) => {
      this.timeSecond--;
      console.log('timeSecond' + this.timeSecond);
      if (this.timeSecond <= 0) {
       // DroneStageManager.getInstance().nextStage(this.point);
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
      at = Math.min(9, at);
      at = Math.max(0, at);
      DeviceManager.getInstance().dispatchCustomEvent(new CustomEvent(DeviceManager.EVENT_OMNIFIT_HEADSET_CONCENTRATION, {detail: at}));
    });
    //집중도
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration;
      if (this.beforeHeadsetConcentration >= 9 && this.headsetConcentration >= 9 ) {
        this.finishCnt--;
      }else {
        this.finishCnt = 3;
      }
      this.point += Number(concentration);
      if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
        DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {score: this.point}));
      }
    });

    this.rollingSubscription = interval(500).subscribe( (it) => {
      if (this.finishCnt <= 0) {
      this.img = [
        DroneResourceManager.getInstance().resources('gage_10_1Img'),
        DroneResourceManager.getInstance().resources('gage_10_2Img'),
        DroneResourceManager.getInstance().resources('gage_10_3Img'),
        DroneResourceManager.getInstance().resources('gage_10_4Img'),
        DroneResourceManager.getInstance().resources('gage_10_5Img')][it % 5];
      }
    });
  }

  onStop(data: any) {
    if (!ValidUtil.isNullOrUndefined(this.pointSubscription)) {this.pointSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.keySubscription)) {this.keySubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.rollingSubscription)) {this.rollingSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

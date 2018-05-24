import {Subscription} from 'rxjs/Subscription';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';
import {DroneStageGame} from '../../stage/DroneStageGame';

export class Score extends ObjDrone {

  // private pointSubscription: Subscription;
  // private point: number;
  private timeSecond: number;
  private resizeSubscription: Subscription;
  private concentrationSubscription: Subscription;
  private beforeHeadsetConcentration = 0;
  private headsetConcentration = 0;
  private finishCnt = 3;

  constructor(stage: DroneStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
   // context.setTransform(1, 0, 0, 1, 0, 0);
   //  context.beginPath();
   //  context.fillStyle = '#FF0000';
   //  context.font = '10pt Calibri';
   //  context.textAlign = 'left';
   //  context.fillText('con:' + this.headsetConcentration + ' [' + (this.headsetConcentration - this.beforeHeadsetConcentration) + ']', 50, 50);
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // context.beginPath();
    // context.fillText('time(' + this.timeSecond + ') point(' + this.point + ')', 50, 60);

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
    }else if (this.finishCnt <= 0 && this.headsetConcentration >= 9) {
      this.img = [
        DroneResourceManager.getInstance().resources('gage_10_1Img'),
        DroneResourceManager.getInstance().resources('gage_10_2Img'),
        DroneResourceManager.getInstance().resources('gage_10_3Img'),
        DroneResourceManager.getInstance().resources('gage_10_4Img'),
        DroneResourceManager.getInstance().resources('gage_10_5Img')][new Date().getSeconds() % 5];
    }
    context.drawImage(this.img, this.x, this.y);
  }

  onStart(data?: any) {
    // this.point = 0;
    this.x = 20;
    this.y = 20;
    this.timeSecond = 60;
    this.finishCnt = 3;
    // this.pointSubscription = interval(1000).subscribe((it) => {
    //   this.timeSecond--;
    //   console.log('timeSecond' + this.timeSecond);
    //   if (this.timeSecond <= 0) {
    //    // DroneStageManager.getInstance().nextStage(this.point);
    //   }
    // });
    //집중도
    console.log('--score id- ' + this.id)
    this.concentrationSubscription = this.stage.eventObservable(DroneStageGame.EVENT_CONCENTRATION).filter( (it) => this.id === it.uuid).subscribe( (concentration) => {

      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration.headsetConcentration || 0;
      const history = concentration.headsetConcentrationHistory || new Array<number>();
      history.forEach( (it) => it >= 9 ? this.finishCnt-- : this.finishCnt = 3);
      // this.point += Number(concentration.headsetConcentration);
      // if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
      //   DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {score: this.point}));
      // }
    });

  }

  onStop(data?: any) {
    // if (!ValidUtil.isNullOrUndefined(this.pointSubscription)) {this.pointSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

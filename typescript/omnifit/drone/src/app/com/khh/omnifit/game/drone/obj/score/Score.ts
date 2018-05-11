import {Observable} from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Subscription} from 'rxjs/Subscription';
import {timer} from 'rxjs/observable/timer';
import {DroneStage} from '../../stage/DroneStage';
import {DroneStageManager} from '../../DroneStageManager';
import {isNullOrUndefined} from 'util';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {interval} from 'rxjs/observable/interval';

export class Score extends ObjDrone {
  // private beforeIntent: Intent<GameData>;
  // private intent: Intent<GameData>;

  // private pointObservable: Observable<number>;


  private pointSubscription: Subscription;
  private point: number;
  private timeSecond: number;
  private resizeSubscription: Subscription;
  private concentrationSubscription: Subscription;
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
    this.timeSecond = 60;
    this.pointSubscription = interval(1000).subscribe((it) => {
      this.timeSecond--;
      console.log('timeSecond' + this.timeSecond);
      if (this.timeSecond <= 0) {
        DroneStageManager.getInstance().nextStage(this.point);
      }
    });
    //집중도
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe(concentration => {
      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration;
      this.point += Number(concentration);
    });
  }


  onStop(data: any) {
    if (!isNullOrUndefined(this.pointSubscription)) {this.pointSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
  }


  onCreate(data?: any) {
  }

  onDestroy(data?: any) {
  }

  onPause(data?: any) {
  }

  onRestart(data?: any) {
  }

  onResume(data?: any) {
  }

}

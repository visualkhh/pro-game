import {Observable} from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Subscription} from 'rxjs/Subscription';
import {timer} from 'rxjs/observable/timer';
import {DroneStage} from '../../stage/DroneStage';
import {DroneStageManager} from '../../DroneStageManager';
import {isNullOrUndefined} from 'util';
import {DeviceManager} from '../../../../drive/DeviceManager';

export class Score extends ObjDrone {

  // private beforeIntent: Intent<GameData>;
  // private intent: Intent<GameData>;


  private pointObservable: Observable<number>;
  private pointSubscription: Subscription;
  private point: number;
  private timeSecond: number;
  private resizeSubscription: Subscription;
  private concentrationSubscription: Subscription;
  private beforeHeadsetConcentration: number;
  private headsetConcentration: number;

  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';
    this.pointObservable = timer(1000, 1000); // 1second
  }



  onDraw(): void {

    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.beginPath();
    context.fillStyle = '#FF0000';
    context.font = '30pt Calibri';
    context.textAlign = 'left';
    context.fillText('con:' + this.headsetConcentration + ' [' + (this.headsetConcentration - this.beforeHeadsetConcentration) + ']', 50, 50);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.beginPath();
    context.fillStyle = '#FF0000';
    context.font = '30pt Calibri';
    context.textAlign = 'right';
    context.fillText('time(' + this.timeSecond + ') point(' + this.point + ')', this.canvas.width, 50);


  }


  onStart(data?: any) {
    super.onStart();
    this.point = 0;
    this.timeSecond = 60;
    this.pointSubscription = this.pointObservable.subscribe((it) => {
      this.timeSecond--;
      console.log('timeSecond' + this.timeSecond);
      if (this.timeSecond <= 0) {
        DroneStageManager.getInstance().nextStage(this.point);
      }
    });
    this.resizeSubscription = Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event) => {
      this.onDraw();
    });
    //집중도
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe(concentration => {
      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration;
      this.point += Number(concentration);
    });
  }


  onStop(data: any) {
    super.onStop();
    if (this.pointSubscription) {
      this.pointSubscription.unsubscribe();
    }
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (!isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
  }

}

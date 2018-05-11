import {ObjDrone} from '../ObjDrone';
import {DroneStage} from '../../stage/DroneStage';
import {Subscription} from 'rxjs/Subscription';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {isNullOrUndefined} from 'util';
import {DroneStageGame} from '../../stage/DroneStageGame';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';

export class Ground extends ObjDrone {


  private maxX = 50;
  private currentX = 0;
  private beforeWind = new PointVector();
  private wind = new PointVector();
  private resizeSubscription: Subscription;
  private windSubscription: Subscription;
  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }
  onDraw(context: CanvasRenderingContext2D): void {
    const x = this.stage.width / 2;
    const y = this.stage.height / 2;
    if (this.beforeWind.x - this.wind.x > 0) {
      this.currentX -= 0.1;
    }else if (this.beforeWind.x - this.wind.x < 0) {
      this.currentX += 0.1;
    }
    context.drawImage(this.img, (x - this.img.width / 2) + this.currentX, this.stage.height -  this.img.height);
  }

  // intentSignal(intent: Intent<GameData>) {
  //   if (this.beforeWind != intent.data.wind.x){
  //     this.beforeWind = intent.data.wind.x;
  //   }else{
  //     this.wind = intent.data.wind.x;
  //   }
  // }
  onStart(data?: any) {
    //바람
    this.windSubscription = this.stage.eventSubscribe(DroneStageGame.EVENT_WIND, (wdata: PointVector) => {
      this.beforeWind = this.wind;
      this.wind = wdata;
    });
  }

  onStop(data?: any) {
    if (!isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.windSubscription)) {this.windSubscription.unsubscribe(); }
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

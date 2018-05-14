import {ObjDrone} from '../ObjDrone';
import {DroneStage} from '../../stage/DroneStage';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {isNullOrUndefined} from 'util';
import {DroneStageGame} from '../../stage/DroneStageGame';
import {Subscription} from 'rxjs/Subscription';

// import { Point } from '../org/Point';
export class Cloud extends ObjDrone {

  private maxX = 50;
  private currentX = 0;
  private beforeWind = new PointVector();
  private wind = new PointVector();
  private windSubscription: Subscription;

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }


  onDraw(context: CanvasRenderingContext2D): void {
    const x = this.stage.width / 2;
    const y = this.stage.height / 2;

    if (this.beforeWind.x - this.wind.x > 0) {
      this.currentX += 0.05;
    }else if (this.beforeWind.x - this.wind.x < 0) {
      this.currentX -= 0.05;
    }
    context.drawImage(this.img, (x - this.img.width / 2)  + this.currentX, 0);
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

  onStart(data?: any) {
    //바람
    this.windSubscription = this.stage.eventSubscribe(DroneStageGame.EVENT_WIND, (wdata: PointVector) => {
      this.beforeWind = this.wind;
      this.wind = wdata;
    });
  }

  onStop(data?: any) {
    if (!isNullOrUndefined(this.windSubscription)) {this.windSubscription.unsubscribe(); }
  }

  // clockSignal(value?: any) {
  //   this.onDraw();
  // }

  // intentSignal(intent: Intent<GameData>) {
  //   if (this.beforeWind != intent.data.wind.x){
  //     this.beforeWind = intent.data.wind.x;
  //   }else{
  //     this.wind = intent.data.wind.x;
  //   }
  // }
}

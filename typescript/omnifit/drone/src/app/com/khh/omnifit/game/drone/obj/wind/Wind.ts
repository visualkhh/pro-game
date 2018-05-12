import {ObjDrone} from '../ObjDrone';
import {DroneStage} from '../../stage/DroneStage';
import {Subscription} from 'rxjs/Subscription';
import {isNullOrUndefined} from 'util';
import {DroneStageGame} from '../../stage/DroneStageGame';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';

export class Wind extends ObjDrone {

  private resizeSubscription: Subscription;
  private windSubscription: Subscription;

  private beforeWind = new PointVector();
  private wind = new PointVector();

  constructor(stage: DroneStage, x: number, y: number, z: number) {
    super(stage, x, y, z);
  }


  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.beginPath();
    context.fillStyle = '#442266';
    context.font = '10pt Calibri';
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('wind:' + this.wind, 50, this.stage.height);
  }


  onStart(data?: any) {
    this.windSubscription = this.stage.eventSubscribe(DroneStageGame.EVENT_WIND, (wdata: PointVector) => {
      this.beforeWind = this.wind;
      this.wind = wdata;
    });
  }

  onStop(data?: any) {
    if (!isNullOrUndefined(this.resizeSubscription)) { this.resizeSubscription.unsubscribe(); }
    if (!isNullOrUndefined(this.windSubscription)) {this.windSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

import {Subscription} from 'rxjs/Subscription';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

// import { Point } from '../org/Point';
export class Star extends ObjDrone {

  private currentX = 0;
  private resizeSubscription: Subscription;

  constructor(stage: DroneStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);
    const x = this.stage.width / 2;
    const y = this.stage.height / 2;

    context.beginPath();
    // context.fillStyle = '#FFFFFF';
    context.fillStyle = 'rgba(255,255,255,0.7)';
    context.arc(this.x, this.y, this.z, 0, 2 * Math.PI);
    context.fill();

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
    this.initSetting();
    this.resizeSubscription = this.stage.canvasEventSubscribe('resize', (event: Event) => this.initSetting());
  }

  onStop(data?: any) {
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
  }

  initSetting() {
    this.x = RandomUtil.random(0, this.stage.width);
    this.y = RandomUtil.random(0, MathUtil.getValueByTotInPercent(this.stage.height, 70));
    this.z = RandomUtil.random(0, 4);
  }
}

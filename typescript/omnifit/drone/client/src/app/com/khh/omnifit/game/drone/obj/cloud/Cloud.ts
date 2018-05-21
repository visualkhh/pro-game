import {Subscription} from 'rxjs/Subscription';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

// import { Point } from '../org/Point';
export class Cloud extends ObjDrone {

  private maxX = 50;
  private currentX = 0;
  private resizeSubscription: Subscription;
  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    // console.log('cccccccc');
  }

  onDraw(context: CanvasRenderingContext2D): void {
    this.x += this.mass;
    context.drawImage(this.img, this.x, this.y);
    // console.log('onDraw ' + this.img);

    //checkEdges
    if (this.x > this.stage.width) {
      this.initSetting();
      this.x = -this.img.width;
    }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
  onStart(data?: any) {
    this.initSetting();
    this.resizeSubscription = this.stage.canvasEventSubscribe('resize', (event: Event) => this.initSetting());
  }

  onStop(data?: any) {
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
  }

  initSetting() {
    this.set(RandomUtil.random(0, this.stage.width),
             RandomUtil.random(0, MathUtil.getValueByTotInPercent(this.stage.height, 70)),
             RandomUtil.random(0, 4));
    this.mass = Math.random();
  }

}

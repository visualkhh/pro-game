import {Subscription} from 'rxjs/Subscription';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWStage} from '../../stage/AWStage';
import {AWObj} from '../AWObj';

// import { Point } from '../org/Point';
export class Cloud extends AWObj {

  private maxX = 50;
  private currentX = 0;
  private resizeSubscription: Subscription;
  constructor(stage: AWStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    // console.log('cccccccc');
  }

  onDraw(context: CanvasRenderingContext2D): void {
    this.x += this.mass;
    context.globalAlpha = 0.1;
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
    this.x = RandomUtil.random(0, this.stage.width);
    this.y = RandomUtil.random(0, this.stage.height);
    this.mass = 5;
  }

}

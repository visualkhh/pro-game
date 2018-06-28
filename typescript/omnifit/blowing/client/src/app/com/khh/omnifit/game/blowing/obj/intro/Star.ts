import {Subscription} from 'rxjs/Subscription';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWStage} from '../../stage/AWStage';
import {AWObj} from '../AWObj';

// import { Point } from '../org/Point';
export class Star extends AWObj {

  private velocity: PointVector;
  private resizeSubscription: Subscription;
  private targetPosition: PointVector;

  constructor(stage: AWStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {

    //////update
    //방향
    const dir = PointVector.sub(this.targetPosition, this);
    dir.normalize();
    dir.mult(0.7);
    const acceleration = dir;
    this.velocity.add(acceleration);
    this.velocity.limit(10);
    const oldPosition = this.get();
    this.add(this.velocity);
    const oldCheck = PointVector.sub(oldPosition, this.targetPosition);
    const check = PointVector.sub(this, this.targetPosition);
    // if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
    //   this.x = this.targetPosition.x;
    //   this.velocity.x = 0;
    // }
    // if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
    //   this.y = this.targetPosition.y;
    //   this.velocity.y = 0;
    // }

    context.beginPath();
    // context.arc(this.x, this.y, this.mass, 0, 2 * Math.PI);
    context.arc(this.x, this.y, this.z, 0, 2 * Math.PI);
    context.fillStyle = 'rgba(0,0,0,0.7)';
    // context.fillStyle = 'rgba(255,0,0,1)';
    context.fill();

    //checkEdges
    if (this.x > this.stage.width) {
      this.initSetting();
    }

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
    this.velocity = new PointVector(0, 0);
    this.x = RandomUtil.random(0, this.stage.height);
    this.y = RandomUtil.random(0, this.stage.height);
    this.z = RandomUtil.random(0, 5);
    this.targetPosition = new PointVector(this.stage.width, RandomUtil.random(this.y - 100, this.y + 100), RandomUtil.random(this.z, 5));
  }
}

import {Subscription} from 'rxjs/Subscription';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class Drone extends ObjDrone {
  private _initX: number;
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private beforePoint: PointVector;

  private beforeConcentration = 0;
  private concentration = 0;
  private beforeWind = new PointVector();
  private wind = new PointVector();

  private concentrationSubscription: Subscription;
  private windSubscription: Subscription;

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);

    //height
    const stepVal = (this.stage.height - this.img.height) / 10;
    const conStepVal = (stepVal * this.concentration);

    //targetPosition
    const targetPosition = new PointVector(this._initX || (this.stage.width / 2), (this.stage.height - this.img.height / 2) - conStepVal);
    targetPosition.add(this.wind);

    //////update
    //방향
    const dir = PointVector.sub(targetPosition, this.position);
    dir.normalize();
    dir.mult(0.2);
    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(2);
    this.position.add(this.velocity);

    //checkEdges
    if (this.position.x > this.stage.width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = this.stage.width;
    }

    if (this.position.y > this.stage.height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = this.stage.height;
    }
    //display
    //http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
    context.beginPath();
    context.strokeStyle = '#FF0000';
    context.lineWidth = 2;
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.arc(this.position.x, this.stage.height, 20, 0, 2 * Math.PI);
    context.fill();
    context.restore();
    context.translate(this.position.x, this.position.y);
    if (!ValidUtil.isNullOrUndefined(this.beforePoint) && this.beforePoint.x - this.position.x > 0) {
      context.rotate(-0.01);
    }else if (!ValidUtil.isNullOrUndefined(this.beforePoint) && this.beforePoint.x - this.position.x < 0) {
      context.rotate(0.01);
    }

    // context.scale(0.5, 0.5);
    context.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
    context.arc(0, 0, 5, 0, 2 * Math.PI);

    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'blue';
    context.fillText(this.id, (-this.img.width / 2) + this.img.width / 2, (-this.img.height / 2));
    context.beginPath();
    this.beforePoint = this.position.get();
  }

  onStart(data?: any) {
    this.position = this.position || new PointVector(RandomUtil.random(this.stage.width), RandomUtil.random(this.stage.height));
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);
    //집중도
    //   this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
    //     this.beforeConcentration = this.concentration;
    //     this.concentration = concentration;
    //   });
    // //바람
    // this.windSubscription = this.stage.eventSubscribe(DroneStageGame.EVENT_WIND, (wdata: PointVector) => {
    //   this.beforeWind = this.wind;
    //   this.wind = wdata;
    // });

  }

  onStop() {
    // if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    // if (!ValidUtil.isNullOrUndefined(this.windSubscription)) {this.windSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

  get initX(): number {
    return this._initX;
  }

  set initX(value: number) {
    this._initX = value;
  }

  public setConcentration(concentration: number): void {
    this.beforeConcentration = this.concentration;
    this.concentration = concentration;
  }
}

import {Subscription} from 'rxjs/Subscription';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export abstract class MoveImg extends ObjDrone {
  // private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private accelerationStep: PointVector;


  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }


  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);
    const targetPosition = this.targetPosition();
    //////update
    //방향
    const dir = PointVector.sub(targetPosition, this);
    const mag = dir.mag();
    dir.normalize();
    dir.mult(this.accelerationStep);
    // dir.mult(0.2);
    this.acceleration = dir; //가속도
    const oldVelocity = this.velocity.get();
    this.velocity.add(this.acceleration); //속도
    const oldPosition = this.get();
    this.add(this.velocity);
    const oldCheck = PointVector.sub(oldPosition, targetPosition);
    const check = PointVector.sub(this, targetPosition);
    if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
      this.x = targetPosition.x;
      this.velocity.x = 0;
    }
    if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
      this.y = targetPosition.y;
      this.velocity.y = 0;
    }

    // context.textAlign = 'center';
    // context.textBaseline = 'middle';

    let x = this.x;
    let y = this.y;
    //https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_textalign
    if (this.imgAlign === 'center') {
      x = this.x - (this.img.width / 2);
    }
    //https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_textbaseline
    if (this.imgBaseline === 'middle') {
      y = this.y - (this.img.height / 2);
    }else if (this.imgBaseline === 'hanging') {
      y = this.y;
    }else if (this.imgBaseline === 'bottom') {
      y = this.y - (this.img.height);
    }
    context.drawImage(this.img, x, y);
  }

  onStart(data?: any) {
    this.set(this.startPosition());
    this.accelerationStep = new PointVector(0.2, 0.2, 0);
    this.acceleration = new PointVector(0, 0);
    this.velocity = new PointVector(0, 0);
  }

  startPosition(): PointVector {
    return new PointVector(RandomUtil.random(this.stage.width), RandomUtil.random(this.stage.height));
  }
  targetPosition(): PointVector {
    return new PointVector((this.stage.width / 2), (this.stage.height / 2));
  }
  onStop() {}
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

}

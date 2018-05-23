import {Subscription} from 'rxjs/Subscription';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class Drone extends ObjDrone {
  private _initX: number;
  // private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private beforePoint: PointVector;

  private beforeConcentration = 0;
  private concentration = 0;
  // private beforeWind = new PointVector();
  // private wind = new PointVector();

  private concentrationSubscription: Subscription;
  private windSubscription: Subscription;

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);

    //height
    const minHeight = this.stage.height - 200;
    const stepVal = (minHeight - 200) / 10;
    const conStepVal = (stepVal * this.concentration);

    //targetPosition
    // const targetPosition = new PointVector(this._initX || (this.stage.width / 2), (this.stage.height - this.img.height / 2) - conStepVal);
    const targetPosition = new PointVector(this._initX || (this.stage.width / 2), (minHeight) - conStepVal);
    // targetPosition.add(this.wind);

    //////update
    //방향
    const dir = PointVector.sub(targetPosition, this);
    // console.log('------ ' + dir.mag())
    // if (dir.mag() > 0) {
    //   this.img = DroneResourceManager.getInstance().resources('character_01Img');
    // }else if (dir.mag() < 0) {
    //   this.img = DroneResourceManager.getInstance().resources('character_01Img');
    // }else {
    //   this.img = DroneResourceManager.getInstance().resources('character_02Img');
    // }
    dir.normalize();
    dir.mult(0.5);
    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(2);
    const oldPosition = this.get();
    this.add(this.velocity);

    const oldCheck = PointVector.sub(oldPosition, targetPosition);
    const check = PointVector.sub(this, targetPosition);
    if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
      // console.log('---');
    }
    if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
      this.y = targetPosition.y;
      // console.log('--**-');
    }

    // const gap = oldPosition.y - this.y;
    // // console.log('--'+ Math.abs(gap))
    // if (gap < 0 && Math.abs(gap) > 2) {
    //   this.img = DroneResourceManager.getInstance().resources('character_03Img');
    // } else if (gap > 0 && Math.abs(gap) > 2) {
    //   this.img = DroneResourceManager.getInstance().resources('character_01Img');
    // } else {
    //   this.img = DroneResourceManager.getInstance().resources('character_02Img');
    // }
    // if (this.beforeConcentration < this.concentration) {
    //   this.img = DroneResourceManager.getInstance().resources('character_01Img');
    // }else if (this.beforeConcentration > this.concentration) {
    //   const img = DroneResourceManager.getInstance().resources('character_03Img');
    //   if (img.src !== this.img.src) {
    //     this.velocity.mult(0);
    //   }
    //   this.img = img;
    //   //this.velocity.mult(0);
    //   // if (this.velocity.y > 0) {
    //   // }
    // }else {
    //   this.img = DroneResourceManager.getInstance().resources('character_02Img');
    // }


    //checkEdges
    // if (this.x > this.stage.width) {
    //   this.x = 0;
    // } else if (this.x < 0) {
    //   this.x = this.stage.width;
    // }
    //
    // if (this.y > this.stage.height) {
    //   this.y = 0;
    // } else if (this.y < 0) {
    //   this.y = this.stage.height;
    // }

    //img
    if (targetPosition.y < this.y) {
      this.img = DroneResourceManager.getInstance().resources('character_02Img');
      const effectImg = DroneResourceManager.getInstance().resources('effect_character02Img');
      const effectImgX = this.x - (effectImg.width / 2);
      const effectImgY = this.y - (effectImg.height / 2) + (this.img.height / 2);
      context.drawImage(effectImg, effectImgX, effectImgY);

    }else if (targetPosition.y > this.y) {
      this.img = DroneResourceManager.getInstance().resources('character_03Img');

      const effectImg = DroneResourceManager.getInstance().resources('effect_character03Img');
      const effectImgX = this.x - (effectImg.width / 2);
      const effectImgY = this.y - (effectImg.height);
      context.drawImage(effectImg, effectImgX, effectImgY);

      // const img = DroneResourceManager.getInstance().resources('character_03Img');
      // if (img.src !== this.img.src) {
      //   this.velocity.mult(0);
      // }
      // this.img = img;
      //this.velocity.mult(0);
      // if (this.velocity.y > 0) {
      // }
    }else {
      this.img = DroneResourceManager.getInstance().resources('character_01Img');
    }




    //display
    //http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
    context.beginPath();
    context.strokeStyle = '#FF0000';
    context.lineWidth = 2;
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fill();
    context.restore();
    // context.translate(this.position.x, this.position.y);
    // if (!ValidUtil.isNullOrUndefined(this.beforePoint) && this.beforePoint.x - this.position.x > 0) {
    //   context.rotate(-0.01);
    // }else if (!ValidUtil.isNullOrUndefined(this.beforePoint) && this.beforePoint.x - this.position.x < 0) {
    //   context.rotate(0.01);
    // }
    // if (!ValidUtil.isNullOrUndefined(this.beforePoint) && this.beforePoint.x - this.position.x > 0) {
    //   context.rotate(-0.01);
    // }else if (!ValidUtil.isNullOrUndefined(this.beforePoint) && this.beforePoint.x - this.position.x < 0) {
    //   context.rotate(0.01);
    // }

    // context.scale(0.5, 0.5);
    const imgX = this.x - (this.img.width / 2);
    const imgY = this.y - (this.img.height / 2);
    context.drawImage(this.img, imgX, imgY);

    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'blue';
    context.fillText(this.id, this.x, imgY);
    // context.arc(this.position.x, imgY, 30, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    this.beforePoint = this.get();
  }

  onStart(data?: any) {
    // this.position = this.position || new PointVector(RandomUtil.random(this.stage.width), RandomUtil.random(this.stage.height));
    this.x  = RandomUtil.random(this.stage.width);
    this.y = this.stage.height;
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);

  }

  onStop() {}
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

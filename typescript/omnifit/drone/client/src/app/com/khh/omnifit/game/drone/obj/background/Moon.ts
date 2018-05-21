import {Subscription} from 'rxjs/Subscription';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {DroneStage} from '../../stage/DroneStage';
import {MoveImg} from '../comm/MoveImg';
import {ObjDrone} from '../ObjDrone';

export class Moon extends MoveImg {

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    this.imgAlign = 'center';
    // this.imgBaseline = 'middle';
    this.imgBaseline = 'hanging';
  }

  startPosition(): PointVector {
    return new PointVector(RandomUtil.random(this.stage.width), this.stage.height);
  }

  targetPosition(): PointVector {
    // return super.targetPosition();
    return new PointVector(MathUtil.getValueByTotInPercent(this.stage.width, 75), 20);
    // return new PointVector(0, 0);
  }
}

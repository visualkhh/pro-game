import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {DroneStage} from '../../stage/DroneStage';
import {MoveImg} from '../comm/MoveImg';

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
    return new PointVector(MathUtil.getValueByTotInPercent(this.stage.width, 10), 100);
    // return new PointVector(0, 0);
  }
}

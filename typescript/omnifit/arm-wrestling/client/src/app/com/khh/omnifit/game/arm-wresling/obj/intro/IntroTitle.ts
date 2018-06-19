import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {MoveImg} from '../comm/MoveImg';
import {ObjAW} from '../ObjAW';

export class IntroTitle extends MoveImg {

  constructor(stage: AWStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    this.imgAlign = 'center';
    this.imgBaseline = 'middle';
  }

  startPosition(): PointVector {
    return new PointVector(RandomUtil.random(this.stage.width), this.stage.height);
  }

  targetPosition(): PointVector {
    // return super.targetPosition();
    return new PointVector((this.stage.width / 2), 80);
    // return new PointVector(0, 0);
  }

}

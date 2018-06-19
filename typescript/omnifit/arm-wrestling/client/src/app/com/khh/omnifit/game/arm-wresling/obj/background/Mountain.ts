import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {AWStage} from '../../stage/AWStage';
import {MoveImg} from '../comm/MoveImg';

export class Mountain extends MoveImg  {

  constructor(stage: AWStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    this.imgAlign = 'center';
    // this.imgBaseline = 'middle';
    this.imgBaseline = 'bottom';
  }

  targetPosition(): PointVector {
    return new PointVector((this.stage.width / 2), (this.stage.height));
  }

  startPosition(): PointVector {
    return new PointVector(RandomUtil.random(this.stage.width), this.stage.height + this.img.height);
  }
}

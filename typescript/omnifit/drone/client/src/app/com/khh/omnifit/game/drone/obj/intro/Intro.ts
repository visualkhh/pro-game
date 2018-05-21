import {Subscription} from 'rxjs/Subscription';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class Intro extends ObjDrone {

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);
    // context.scale(2, 2);
    context.drawImage(this.img, (this.stage.width / 2) - this.img.width / 2, (this.stage.height / 2) - this.img.height / 2);
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
  onStart(data?: any) {
  }

  onStop(data?: any) {
  }

}

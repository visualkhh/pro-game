import {Subscription} from 'rxjs/Subscription';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class Intro extends ObjDrone {

  private intro_02Img = DroneResourceManager.getInstance().resources('intro_02Img');
  private intro_text_01Img = DroneResourceManager.getInstance().resources('intro_text_01Img');
  private intro_text_02Img = DroneResourceManager.getInstance().resources('intro_text_02Img');

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    //context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(this.intro_text_01Img, (this.stage.width / 2) - this.intro_text_01Img.width / 2, 20);
    context.drawImage(this.intro_02Img, (this.stage.width / 2) - this.intro_02Img.width / 2, (this.stage.height / 2) - this.intro_02Img.height / 2);

    context.beginPath();
    context.rect(0, this.stage.height - MathUtil.getValueByTotInPercent(this.stage.height, 50), this.stage.width, this.stage.height);
    const grd = context.createLinearGradient(this.stage.width / 2, 0, this.stage.width / 2, this.stage.height);
    //context.globalCompositeOperation = "destination-out";
    grd.addColorStop(0.0, 'rgba(0,0,0,0.0)');
    grd.addColorStop(0.1, 'rgba(0,0,0,0.0)');
    grd.addColorStop(0.2, 'rgba(0,0,0,0.0)');
    grd.addColorStop(0.3, 'rgba(0,0,0,0.0)');
    grd.addColorStop(0.4, 'rgba(0,0,0,0.0)');
    grd.addColorStop(0.5, 'rgba(0,0,0,0.0)');
    grd.addColorStop(0.8, 'rgba(0,0,0,0.8)');
    grd.addColorStop(1.0, 'rgba(0,0,0,1.0)');

    context.fillStyle = grd;
    context.fill();

    context.drawImage(this.intro_text_02Img, (this.stage.width / 2) - this.intro_text_02Img.width / 2, this.stage.height - (this.intro_text_02Img.height) - 50);
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

import {Subscription} from 'rxjs/Subscription';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStageManager} from '../../DroneStageManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class IntroPopup extends ObjDrone {
  private mousedownSubscription: Subscription;
  private hitArea: Rect;
  private introPopup;
  constructor(stage: DroneStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {

    this.x = (this.stage.width / 2) - this.img.width / 2;
    this.y = this.stage.height - (this.img.height) - 50;
    const imgStartX = this.x;
    const imgStartY = this.y;
    const imgEndX = this.x + this.img.width;
    const imgEndY = this.y + this.img.height;
    this.hitArea = new Rect(imgStartX, imgStartY, imgEndX, imgEndY);

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

    if (!ValidUtil.isNullOrUndefined(this.introPopup)) {
      context.drawImage(this.introPopup, (this.stage.width / 2) - this.introPopup.width / 2, (this.stage.height / 2) - this.introPopup.height / 2);
    }
    // if ((new Date().getSeconds() % 2) / 0.5) {
    if (Math.floor(new Date().getMilliseconds() / 500)) {
      context.drawImage(this.img, this.x, this.y);
    }
  }

  onStart(data?: any) {
    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      // console.log('--' + event.offsetX + ',' + event.offsetY + '   ' + this.hitArea.contains(event.offsetX, event.offsetY) + this.hitArea);
      if (ValidUtil.isNullOrUndefined(this.introPopup)) {
        this.introPopup = DroneResourceManager.getInstance().resources('intro_popupImg');
      }else if (!ValidUtil.isNullOrUndefined(this.introPopup)) {
        DroneStageManager.getInstance().nextStage();
      }

      // if (!ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
      //    DroneStageManager.getInstance().nextStage();
      // }
    });
  }

  onStop() {
    console.log('touchScreen stop');
    if (!ValidUtil.isNullOrUndefined(this.mousedownSubscription)) {this.mousedownSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

}

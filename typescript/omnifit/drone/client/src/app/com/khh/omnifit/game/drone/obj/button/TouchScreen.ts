import {Subscription} from 'rxjs/Subscription';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStageManager} from '../../DroneStageManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class TouchScreen extends ObjDrone {
  private mousedownSubscription: Subscription;
  private hitArea: Rect;
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

    // if ((new Date().getSeconds() % 2) / 0.5) {
    if (Math.floor(new Date().getMilliseconds() / 500)) {
      context.drawImage(this.img, this.x, this.y);
    }
  }

  onStart(data?: any) {
    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      console.log('--' + event.offsetX + ',' + event.offsetY + '   ' + this.hitArea.contains(event.offsetX, event.offsetY) + this.hitArea);
      if (!ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
         DroneStageManager.getInstance().nextStage();
      }
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

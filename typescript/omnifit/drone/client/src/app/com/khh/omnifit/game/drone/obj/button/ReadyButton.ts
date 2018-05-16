import {Subscription} from 'rxjs/Subscription';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class ReadyButton extends ObjDrone {
  private yelloImg: HTMLImageElement;
  private greenImg: HTMLImageElement;
  // private mousemoveSubscription: Subscription;
  private mousedownSubscription: Subscription;
  private hitArea: Rect;
  private btnText = '준비하기';
  constructor(stage: DroneStage, x: number, y: number, z: number, greenImg: HTMLImageElement, yelloImg: HTMLImageElement) {
    super(stage, x, y, z);
    this.greenImg = greenImg;
    this.img = this.yelloImg = yelloImg;
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);
    // context.scale(0.5, 0.5);

    const imgStartX = this.stage.width - this.img.width;
    const imgStartY = this.stage.height - this.img.height;
    const imgEndX = this.stage.width + this.img.width;
    const imgEndY = this.stage.height + this.img.height;
    this.hitArea = new Rect(imgStartX, imgStartY, imgEndX, imgEndY);
    context.drawImage(this.img, imgStartX, imgStartY);
    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'blue';
    context.fillText(this.btnText, this.stage.width - this.img.width / 2 , this.stage.height - this.img.height / 2);
  }

  onStart(data?: any) {
    // this.mousemoveSubscription = this.stage.canvasEventSubscribe('mousemove', (event: MouseEvent) => {
    //   console.log('--' + event.offsetX + ',' + event.offsetY)
    //   if (ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
    //     this.img = this.greenImg;
    //   }
    // });
    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      console.log('--' + event.offsetX + ',' + event.offsetY);
      if (!ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
          this.img = this.greenImg;
          this.btnText = '5';
      }
    });
  }

  onStop() {
    // if (!ValidUtil.isNullOrUndefined(this.mousemoveSubscription)) {this.mousemoveSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.mousedownSubscription)) {this.mousedownSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

}

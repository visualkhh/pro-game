import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneStageManager} from '../../DroneStageManager';
import {DroneStage} from '../../stage/DroneStage';
import {ObjDrone} from '../ObjDrone';

export class ReadyButton extends ObjDrone {
  private mousedownSubscription: Subscription;
  private hitArea: Rect;
  private btnText = '시작(준비)하기';
  constructor(stage: DroneStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {

    const fontPT = 50;
    const tw = (context.measureText(this.btnText).width / 2);
    const th = fontPT * 1.5;

    this.x = this.stage.width / 2;
    this.y = this.stage.height / 2;
    const imgStartX = this.x - tw;
    const imgStartY = this.y - th;
    const imgEndX = this.x + this.img.width + tw ;
    const imgEndY = this.y + this.img.height + th ;
    this.hitArea = new Rect(imgStartX, imgStartY, imgEndX, imgEndY);

    context.font = 'bold  ' + fontPT + 'pt Multicolore';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'blue';
    context.fillText(this.btnText, this.stage.width / 2, this.stage.height / 2);
  }

  onStart(data?: any) {
    // this.mousemoveSubscription = this.stage.canvasEventSubscribe('mousemove', (event: MouseEvent) => {
    //   console.log('--' + event.offsetX + ',' + event.offsetY)
    //   if (ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
    //     this.img = this.greenImg;
    //   }
    // });
    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      if (!ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
          this.btnText = '준비중..';
          if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
            DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {status: 'ready'}));
          }
      }
    });
  }

  onStop() {
    if (!ValidUtil.isNullOrUndefined(this.mousedownSubscription)) {this.mousedownSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

}

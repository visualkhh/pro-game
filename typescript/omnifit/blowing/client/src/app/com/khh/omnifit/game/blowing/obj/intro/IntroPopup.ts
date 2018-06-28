import {Subscription} from 'rxjs/Subscription';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {Level1} from '../../algo/Level1';
import {Level2} from '../../algo/Level2';
import {Level3} from '../../algo/Level3';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStageManager} from '../../AWStageManager';
import {AWStage} from '../../stage/AWStage';
import {AWObj} from '../AWObj';

export class IntroPopup extends AWObj {
  private mousedownSubscription: Subscription;
  private hitArea: Rect;
  private introPopup: HTMLImageElement;
  private btn1levelImg: HTMLImageElement;
  private btn2levelImg: HTMLImageElement;
  private btn3levelImg: HTMLImageElement;
  private btn1levelImgHit: Rect;
  private btn2levelImgHit: Rect;
  private btn3levelImgHit: Rect;
  constructor(stage: AWStage, x: number, y: number, z: number, img: HTMLImageElement) {
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
      const x1 = (this.stage.width / 2) - (this.btn1levelImg.width / 2) - (this.btn1levelImg.width + 20);
      const x2 = (this.stage.width / 2) - (this.btn2levelImg.width / 2) - (0);
      const x3 = (this.stage.width / 2) - (this.btn3levelImg.width / 2) + (this.btn3levelImg.width + 20);
      const y1 = (this.stage.height / 2) - this.btn1levelImg.height / 2;
      const y2 = (this.stage.height / 2) - this.btn2levelImg.height / 2;
      const y3 = (this.stage.height / 2) - this.btn3levelImg.height / 2;

      context.drawImage(this.btn1levelImg, x1, y1);
      context.drawImage(this.btn2levelImg, x2, y2);
      context.drawImage(this.btn3levelImg, x3, y3);
      this.btn1levelImgHit = new Rect(x1, y1, x1 + this.btn1levelImg.width, y1 + this.btn1levelImg.height);
      this.btn2levelImgHit = new Rect(x2, y2, x2 + this.btn2levelImg.width, y2 + this.btn2levelImg.height);
      this.btn3levelImgHit = new Rect(x3, y3, x3 + this.btn3levelImg.width, y3 + this.btn3levelImg.height);
    }
    // if ((new Date().getSeconds() % 2) / 0.5) {
    if (Math.floor(new Date().getMilliseconds() / 500)) {
      context.drawImage(this.img, this.x, this.y);
    }
  }

  setupPopup() {
    this.introPopup = AWResourceManager.getInstance().resources('intro_popupImg');
    this.btn1levelImg = AWResourceManager.getInstance().resources('btn1levelImg');
    this.btn2levelImg = AWResourceManager.getInstance().resources('btn2levelImg');
    this.btn3levelImg = AWResourceManager.getInstance().resources('btn3levelImg');
  }
  onStart(data?: any) {
    if (!ValidUtil.isNullOrUndefined(data)) {
      this.setupPopup();
    }

    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      // console.log('--' + event.offsetX + ',' + event.offsetY + '   ' + this.hitArea.contains(event.offsetX, event.offsetY) + this.hitArea);
      if (ValidUtil.isNullOrUndefined(this.introPopup)) {
        this.setupPopup();
      }else if (!ValidUtil.isNullOrUndefined(this.btn1levelImgHit) && this.btn1levelImgHit.contains(event.offsetX, event.offsetY)) {
        AWStageManager.getInstance().nextStage(new Level1('level1', 'other', 'char_00').onCreate().onStart());
      }else if (!ValidUtil.isNullOrUndefined(this.btn2levelImgHit) && this.btn2levelImgHit.contains(event.offsetX, event.offsetY)) {
        AWStageManager.getInstance().nextStage(new Level2('level2', 'other', 'char_01').onCreate().onStart());
      }else if (!ValidUtil.isNullOrUndefined(this.btn3levelImgHit) && this.btn3levelImgHit.contains(event.offsetX, event.offsetY)) {
        AWStageManager.getInstance().nextStage(new Level3('level3', 'other', 'char_02').onCreate().onStart());
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

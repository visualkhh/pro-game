import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {Algo} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Algo';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {ObjAW} from '../ObjAW';

export class Arm extends ObjAW {
  private velocity: PointVector;
  private acceleration: PointVector;
  private roomDetailSubscription: Subscription;
  private room: Room<Algo>;
  private percent = 50;
  private ang = 0;

  constructor(stage: AWStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    this.imgAlign = 'center';
    this.imgBaseline = 'bottom';
  }

  onDraw(context: CanvasRenderingContext2D): void {
    const ximg  = this.stage.width / 2;
    const yimg = this.stage.height;
    const stepVal = 100 / 10;
    const concentration = this.concentration;
    const conStepVal = (stepVal * (this.status === 'run' || this.status === 'end' ? concentration : 0));
    //targetPosition
    const targetPosition = new PointVector(this.stage.width / 2, 0);

    //////update
    //방향
    const dir = PointVector.sub(targetPosition, this);
    dir.normalize();
    dir.mult(0.5);
    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(2);
    const oldPosition = this.get();
    this.add(this.velocity);

    const point = this.drawRotateImage(context, this.img, ximg, yimg, -90);
    // context.drawImage(this.img, x - this.img.width / 2, y - this.img.height / 2);
    // console.log(point.x + ' ' + point.y + ' ---  ' + (x - this.img.width / 2) + ' ' + (y - this.img.height / 2));
    // context.save(); //saves the state of canvas
    // context.clearRect(0, 0, this.stage.width, this.stage.height); //clear the canvas
    // context.translate(this.stage.width / 2, this.stage.height / 2); //let's translate
    // context.rotate(Math.PI / 180 * (this.ang += 5)); //increment the angle and rotate the image
    // // context.translate(-(this.stage.width / 2), -(this.stage.height / 2)); //let's translate
    // // context.drawImage(this.img, this.stage.width / 2 - this.img.width / 2, this.stage.height / 2 - this.img.height / 2, this.img.width, this.img.height); //draw the image ;)
    // context.drawImage(this.img, 100, 100, this.img.width, this.img.height); //draw the image ;)
    // context.setTransform(1, 0, 0, 1, 0, 0);
    //context.restore(); //restore the state of canvas

    // //height
    // const minHeight = this.stage.height - 200;
    // const stepVal = (minHeight - 200) / 10;
    // const conStepVal = (stepVal * (this.status === 'run' || this.status === 'end' ? concentration : 0));
    // const finishCnt = (this.status === 'run' || this.status === 'end' ? this.finishCnt : Info.FINISH_CNT);
    //
    // //targetPosition
    // const targetPosition = new PointVector(this._initX || (this.stage.width / 2), minHeight - conStepVal);
    //
    // //////update
    // //방향
    // const dir = PointVector.sub(targetPosition, this);
    // dir.normalize();
    // dir.mult(0.5);
    // this.acceleration = dir;
    // this.velocity.add(this.acceleration);
    // this.velocity.limit(2);
    // const oldPosition = this.get();
    // this.add(this.velocity);
    //
    // const oldCheck = PointVector.sub(oldPosition, targetPosition);
    // const check = PointVector.sub(this, targetPosition);
    // if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
    // }
    // if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
    //   this.y = targetPosition.y;
    // }
    //
    //
    // //bg
    // const bgImg = AWResourceManager.getInstance().resources('character_right_bgImg');
    // const bgImgX = this.x - (bgImg.width / 2);
    // const bgImgY = this.y - (bgImg.height / 2);
    // context.drawImage(bgImg, bgImgX, bgImgY);
    //
    // //img
    // //올라가기
    // if (finishCnt >= Info.FINISH_CNT && targetPosition.y < this.y) {
    //   const effectImg = AWResourceManager.getInstance().resources('effect_character02Img');
    //   const effectImgX = this.x - (effectImg.width / 2);
    //   const effectImgY = this.y - (effectImg.height / 2) + (this.img.height / 2);
    //   this.img = this.upCharacte(this.name);
    //   context.drawImage(effectImg, effectImgX, effectImgY);
    // }else if (finishCnt >= Info.FINISH_CNT && targetPosition.y > this.y) {//내려가기
    //   const effectImg = AWResourceManager.getInstance().resources('effect_character03Img');
    //   const effectImgX = this.x - (effectImg.width / 2);
    //   const effectImgY = this.y - (effectImg.height);
    //   context.drawImage(effectImg, effectImgX, effectImgY);
    //   this.img = this.downCharacte(this.name);
    // }else if (finishCnt >= Info.FINISH_CNT) {
    //   //일반모습
    //   if (concentration === 8) {
    //     this.img = this.wingCharacte(this.name);
    //   }else {
    //     this.img = this.normalCharacte(this.name);
    //   }
    // }else if (finishCnt === 1) { //날개 후광
    //   const effectImg = AWResourceManager.getInstance().resources('effect_character04_3Img');
    //   const effectImgX = this.x - (effectImg.width / 2);
    //   const effectImgY = this.y - (effectImg.height / 2);
    //   context.drawImage(effectImg, effectImgX, effectImgY);
    //   this.img = this.wingCharacte(this.name);
    // }else if (finishCnt <= 0) { //날개 후광 득도
    //   const effectImg = AWResourceManager.getInstance().resources('effect_character04_3Img');
    //   const effectImgX = this.x - (effectImg.width / 2);
    //   const effectImgY = this.y - (effectImg.height / 2);
    //   context.drawImage(effectImg, effectImgX, effectImgY);
    //   const effect2Img = AWResourceManager.getInstance().resources('effect_character04_4Img');
    //   const effect2ImgX = this.x - (effect2Img.width / 2);
    //   const effect2ImgY = this.y - (effect2Img.height + this.img.height / 2);
    //   context.drawImage(effect2Img, effect2ImgX, effect2ImgY);
    //   this.img = this.wingCharacte(this.name);
    // }
    //
    // //display
    // //http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
    // context.beginPath();
    // context.strokeStyle = '#FF0000';
    // context.lineWidth = 2;
    // context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    // context.fill();
    // context.restore();
    //
    // // context.scale(0.5, 0.5);
    // const imgX = this.x - (this.img.width / 2);
    // const imgY = this.y - (this.img.height / 2);
    // context.drawImage(this.img, imgX, imgY);
    //
    // context.font = '10pt Calibri';
    // context.textAlign = 'center';
    // context.textBaseline = 'middle';
    // context.fillStyle = 'blue';
    // // context.fillText(this.name + ' -**********- ', this.x, imgY);
    // // context.fillText(this.id, this.x, imgY);
    // context.fill();
    // context.beginPath();
    //
    // if ('other' === this.host) {
    // context.translate(this.x - 60, this.y + 55);
    // context.scale(0.3, 0.3);
    // // this.score.x = -this.img.width;
    // // this.score.y = this.img.height + 20;
    // this.stage.resetContext(context);
    // }else if ('host' === this.host) {
    //   const arrowImg = AWResourceManager.getInstance().resources('ranking_shape_02_arrowImg');
    //   context.drawImage(arrowImg, this.x - (arrowImg.width / 2), imgY - 4);
    // }
  }

  onStart(data?: any) {
    console.log('drone start id ' + this.id);
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);
    this.set(0, 0, 0);
    this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).filter( (it) => !ValidUtil.isNullOrUndefined(it.users) && it.users.length >= 2 ).subscribe( (room: Room<Algo>) => {
      this.room = room;
    });
  }

  onStop() {
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';
import {Info} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/info/Info';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStage} from '../../stage/DroneStage';
import {DroneStageEvent} from '../../stage/DronStageEvent';
import {ObjDrone} from '../ObjDrone';
import {Score} from '../score/Score';

export class Drone extends ObjDrone {
  private _name: string;
  private _initX: number;
  // private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private _host: string;
  private beforeConcentration = 0;
  private concentration = 0;
  private finishCnt = Info.FINISH_CNT;
  private score: Score;

  private concentrationSubscription: Subscription;
  private roomDetailSubscription: Subscription;
  private status: string;

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get host(): string {
    return this._host;
  }

  set host(value: string) {
    this._host = value;
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.setTransform(1, 0, 0, 1, 0, 0);

    //height
    const minHeight = this.stage.height - 200;
    const stepVal = (minHeight - 200) / 10;
    const concentration = this.concentration;
    const conStepVal = (stepVal * (this.status === 'run' || this.status === 'end' ? concentration : 0));
    const finishCnt = (this.status === 'run' || this.status === 'end' ? this.finishCnt : Info.FINISH_CNT);

    //targetPosition
    const targetPosition = new PointVector(this._initX || (this.stage.width / 2), minHeight - conStepVal);

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

    const oldCheck = PointVector.sub(oldPosition, targetPosition);
    const check = PointVector.sub(this, targetPosition);
    if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
    }
    if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
      this.y = targetPosition.y;
    }

    // const gap = oldPosition.y - this.y;
    // // console.log('--'+ Math.abs(gap))
    // if (gap < 0 && Math.abs(gap) > 2) {
    //   this.img = DroneResourceManager.getInstance().resources('character_03Img');
    // } else if (gap > 0 && Math.abs(gap) > 2) {
    //   this.img = DroneResourceManager.getInstance().resources('character_01Img');
    // } else {
    //   this.img = DroneResourceManager.getInstance().resources('character_02Img');
    // }
    // if (this.beforeConcentration < this.concentration) {
    //   this.img = DroneResourceManager.getInstance().resources('character_01Img');
    // }else if (this.beforeConcentration > this.concentration) {
    //   const img = DroneResourceManager.getInstance().resources('character_03Img');
    //   if (img.src !== this.img.src) {
    //     this.velocity.mult(0);
    //   }
    //   this.img = img;
    //   //this.velocity.mult(0);
    //   // if (this.velocity.y > 0) {
    //   // }
    // }else {
    //   this.img = DroneResourceManager.getInstance().resources('character_02Img');
    // }

    //checkEdges
    // if (this.x > this.stage.width) {
    //   this.x = 0;
    // } else if (this.x < 0) {
    //   this.x = this.stage.width;
    // }
    //
    // if (this.y > this.stage.height) {
    //   this.y = 0;
    // } else if (this.y < 0) {
    //   this.y = this.stage.height;
    // }

    //bg
    const bgImg = DroneResourceManager.getInstance().resources('character_right_bgImg');
    const bgImgX = this.x - (bgImg.width / 2);
    const bgImgY = this.y - (bgImg.height / 2);
    context.drawImage(bgImg, bgImgX, bgImgY);

    //img
    //올라가기
    if (finishCnt >= Info.FINISH_CNT && targetPosition.y < this.y) {
      const effectImg = DroneResourceManager.getInstance().resources('effect_character02Img');
      const effectImgX = this.x - (effectImg.width / 2);
      const effectImgY = this.y - (effectImg.height / 2) + (this.img.height / 2);
      this.img = this.upCharacte(this.name);
      context.drawImage(effectImg, effectImgX, effectImgY);
    }else if (finishCnt >= Info.FINISH_CNT && targetPosition.y > this.y) {//내려가기
      const effectImg = DroneResourceManager.getInstance().resources('effect_character03Img');
      const effectImgX = this.x - (effectImg.width / 2);
      const effectImgY = this.y - (effectImg.height);
      context.drawImage(effectImg, effectImgX, effectImgY);
      this.img = this.downCharacte(this.name);
    }else if (finishCnt >= Info.FINISH_CNT) {
      //일반모습
      if (concentration === 8) {
        this.img = this.wingCharacte(this.name);
      }else {
        this.img = this.normalCharacte(this.name);
      }
    }else if (finishCnt === 1) { //날개 후광
      const effectImg = DroneResourceManager.getInstance().resources('effect_character04_3Img');
      const effectImgX = this.x - (effectImg.width / 2);
      const effectImgY = this.y - (effectImg.height / 2);
      context.drawImage(effectImg, effectImgX, effectImgY);
      this.img = this.wingCharacte(this.name);
    }else if (finishCnt <= 0) { //날개 후광 득도
      const effectImg = DroneResourceManager.getInstance().resources('effect_character04_3Img');
      const effectImgX = this.x - (effectImg.width / 2);
      const effectImgY = this.y - (effectImg.height / 2);
      context.drawImage(effectImg, effectImgX, effectImgY);
      const effect2Img = DroneResourceManager.getInstance().resources('effect_character04_4Img');
      const effect2ImgX = this.x - (effect2Img.width / 2);
      const effect2ImgY = this.y - (effect2Img.height + this.img.height / 2);
      context.drawImage(effect2Img, effect2ImgX, effect2ImgY);
      this.img = this.wingCharacte(this.name);
    }

    //display
    //http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
    context.beginPath();
    context.strokeStyle = '#FF0000';
    context.lineWidth = 2;
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fill();
    context.restore();

    // context.scale(0.5, 0.5);
    const imgX = this.x - (this.img.width / 2);
    const imgY = this.y - (this.img.height / 2);
    context.drawImage(this.img, imgX, imgY);

    context.font = '10pt Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'blue';
    // context.fillText(this.name + ' -**********- ', this.x, imgY);
    // context.fillText(this.id, this.x, imgY);
    context.fill();
    context.beginPath();

    if ('other' === this.host) {
    context.translate(this.x, this.y);
    context.scale(0.35, 0.35);
    this.score.x = -this.img.width;
    this.score.y = this.img.height + 20;
    this.score.onDraw(context);
    }else if ('host' === this.host) {
      const arrowImg = DroneResourceManager.getInstance().resources('ranking_shape_02_arrowImg');
      context.drawImage(arrowImg, this.x - (arrowImg.width / 2), imgY - 4);
    }
  }

  onStart(data?: any) {
    console.log('drone start id ' + this.id);
    this.beforeConcentration = 0;
    this.concentration = 0;
    this.status = undefined;
    this.score = new Score(this.stage, 0, 0, 0, DroneResourceManager.getInstance().resources('gage_00Img'));
    this.score.id = this.id;
    this.score.onCreate();
    this.score.onStart();

    this.finishCnt = Info.FINISH_CNT;
    //height
    const minHeight = this.stage.height - 200;
    const stepVal = (minHeight - 200) / 10;
    const conStepVal = (stepVal * this.concentration);

    // this.x  = this._initX || (this.stage.width / 2);
    // this.y = minHeight - conStepVal;
    this.x  = RandomUtil.random(this.stage.width);
    this.y = this.stage.height;
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);

    this.roomDetailSubscription = this.stage.eventObservable(DroneStageEvent.EVENT_ROOM_DETAIL).subscribe( (room: Room<any>) => {
      this.status = room.status;
    });
    this.concentrationSubscription = this.stage.eventObservable(DroneStageEvent.EVENT_CONCENTRATION).filter( (it) => this.id === it.uuid).subscribe( (concentration) => {
      this.beforeConcentration = this.concentration;
      this.concentration = concentration.headsetConcentration || 0;
      const history = concentration.headsetConcentrationHistory || new Array<number>();
      this.finishCnt = Info.FINISH_CNT;
      history.forEach( (it) => it >= 9 ? this.finishCnt-- : this.finishCnt = Info.FINISH_CNT);
    });

  }

  onStop() {
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    this.score.onStop();
    this.score.onDestroy();
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

  get initX(): number {
    return this._initX;
  }

  set initX(value: number) {
    this._initX = value;
  }

  normalCharacte(name: string): HTMLImageElement {
    let img = DroneResourceManager.getInstance().resources('character_3_01Img');
    switch (name) {
      case 'do': img = DroneResourceManager.getInstance().resources('character_01Img'); break;
      case 'so': img = DroneResourceManager.getInstance().resources('character_2_01Img'); break;
      case 'bs': img = DroneResourceManager.getInstance().resources('character_3_01Img'); break;
      default: img = DroneResourceManager.getInstance().resources('character_3_01Img'); break;
    }
    return img;
  }
  downCharacte(name: string): HTMLImageElement {
    const type = Math.floor(new Date().getMilliseconds() / 500);
    let img =  type ? DroneResourceManager.getInstance().resources('character_3_03_1Img') : DroneResourceManager.getInstance().resources('character_3_03_2Img');
    switch (name) {
      case 'do': img = type ? DroneResourceManager.getInstance().resources('character_03Img') : DroneResourceManager.getInstance().resources('character_03_1Img'); break;
      case 'so': img = type ? DroneResourceManager.getInstance().resources('character_2_03_1Img') : DroneResourceManager.getInstance().resources('character_2_03_2Img'); break;
      case 'bs': img = type ? DroneResourceManager.getInstance().resources('character_3_03_1Img') : DroneResourceManager.getInstance().resources('character_3_03_2Img'); break;
      default: img = type ? DroneResourceManager.getInstance().resources('character_3_03_1Img') : DroneResourceManager.getInstance().resources('character_3_03_2Img'); break;
    }
    return img;
  }
  upCharacte(name: string): HTMLImageElement {
    let img = DroneResourceManager.getInstance().resources('character_3_02Img');
    switch (name) {
      case 'do': img = DroneResourceManager.getInstance().resources('character_02Img'); break;
      case 'so': img = DroneResourceManager.getInstance().resources('character_2_02Img'); break;
      case 'bs': img = DroneResourceManager.getInstance().resources('character_3_02Img'); break;
      default: img = DroneResourceManager.getInstance().resources('character_3_02Img'); break;
    }
    return img;
  }
  wingCharacte(name: string): HTMLImageElement {
    let img = DroneResourceManager.getInstance().resources('character_3_04Img');
    switch (name) {
      case 'do': img = DroneResourceManager.getInstance().resources('character_04Img'); break;
      case 'so': img = DroneResourceManager.getInstance().resources('character_2_04Img'); break;
      case 'bs': img = DroneResourceManager.getInstance().resources('character_3_04Img'); break;
      default: img = DroneResourceManager.getInstance().resources('character_3_04Img'); break;
    }
    return img;
  }
  // /** @deprecated */
  // public setConcentration(concentration: number): void {
  //   this.beforeConcentration = this.concentration;
  //   this.concentration = concentration;
  //   if (this.beforeConcentration >= 9 && this.concentration >= 9 ) {
  //     this.FINISH_CNT--;
  //   }else {
  //     this.FINISH_CNT = 3;
  //   }
  // }
}

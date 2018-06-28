import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWObj} from '../AWObj';

export class Score extends AWObj {

  private velocity: PointVector;
  private acceleration: PointVector;
  private accelerationStep: PointVector;
  private resizeSubscription: Subscription;
  private beforeHeadsetConcentration = 0;
  private headsetConcentration = 0;
  private roomDetailSubscription: Subscription;
  private room: Room;

  constructor(stage: AWStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {

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

    const headsetConcentration = Math.min(10, this.room ? this.room.local.headsetConcentration : 0);
    const gageBg = AWResourceManager.getInstance().resources('gage_bgImg');
    const badge = AWResourceManager.getInstance().resources('gage_badge_offImg');

    const gageBgX = (this.stage.width / 2) - (gageBg.width / 2);
    const gageBgY = this.stage.height - gageBg.height - 10;
    const bageX = gageBgX - (badge.width / 2);
    const bageY = gageBgY - (badge.height / 4);
    const gageBgCenterX = gageBgX + gageBg.width / 2;
    const gageBgCenterY = gageBgY + gageBg.height / 2;
    context.drawImage(gageBg, gageBgX, gageBgY);
    const scoreX = gageBgX + 8;
    const scoreWidth = gageBg.width - 15;
    const scoreY = gageBgY + 8;
    const scoreHeight = gageBg.height - 20;
    //////update
    // //targetPosition
    const stepVal = (scoreWidth) / 10;
    const targetPosition = new PointVector(stepVal * headsetConcentration, scoreY);
    // //방향
    const dir = PointVector.sub(targetPosition, this);
    dir.normalize();
    dir.mult(0.7);
    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(7);
    const oldPosition = this.get();
    this.add(this.velocity);
    const oldCheck = PointVector.sub(oldPosition, targetPosition);
    const check = PointVector.sub(this, targetPosition);
    if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
      this.x = targetPosition.x;
      this.velocity.x = 0;
    }
    if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
      this.y = targetPosition.y;
      this.velocity.y = 0;
    }
    if (this.x > 1) {
      this.roundedRect(context, scoreX, scoreY, this.x, scoreHeight, 10);
      const grds = context.createLinearGradient(scoreX + scoreWidth, scoreY, scoreX + scoreWidth, scoreY + scoreHeight);
      grds.addColorStop(0, '#96F3F3');
      grds.addColorStop(0.5, '#17BCD4');
      grds.addColorStop(1, '#51CFDE');
      context.fillStyle = grds;
      context.fill();
    }

    context.drawImage(badge, bageX, bageY);

  }

  onStart(data?: any) {
    this.beforeHeadsetConcentration = 0;
    this.headsetConcentration = 0;
    this.accelerationStep = new PointVector(0.2, 0.2, 0);
    this.acceleration = new PointVector(0, 0);
    this.velocity = new PointVector(0, 0);
    //집중도
    this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).filter( (it) => !ValidUtil.isNullOrUndefined(it.local) && !ValidUtil.isNullOrUndefined(it.other)).subscribe( (room: Room) => {
      this.room = room;
    });

  }

  onStop(data?: any) {
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

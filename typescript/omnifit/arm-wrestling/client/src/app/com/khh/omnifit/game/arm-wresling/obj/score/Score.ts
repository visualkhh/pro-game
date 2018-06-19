import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {Info} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/info/Info';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {Algo} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Algo';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWStageGame} from '../../stage/AWStageGame';
import {ObjAW} from '../ObjAW';

export class Score extends ObjAW {

  private velocity: PointVector;
  private acceleration: PointVector;
  private accelerationStep: PointVector;
  private resizeSubscription: Subscription;
  private beforeHeadsetConcentration = 0;
  private headsetConcentration = 0;
  private roomDetailSubscription: Subscription;
  private room: Room<Algo>;

  constructor(stage: AWStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    if (ValidUtil.isNullOrUndefined(this.room)) {return; }

    Observable.from(this.room.users).first((it) => 'local' === it.host).subscribe((local) => {
      const headsetConcentration = Math.min(10, local.headsetConcentration);
      const bageX = 20;
      const bageY = 20;
      const gageBg = AWResourceManager.getInstance().resources('gage_bgImg');
      const gageBgX = bageX + 40;
      const gageBgY = bageY + 15;
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
      dir.mult(0.5);
      this.acceleration = dir;
      this.velocity.add(this.acceleration);
      this.velocity.limit(2);
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
      }
      const grd = context.createLinearGradient(scoreX + scoreWidth, scoreY, scoreX + scoreWidth, scoreY + scoreHeight);
      grd.addColorStop(0, '#96F3F3');
      grd.addColorStop(0.5, '#17BCD4');
      grd.addColorStop(1, '#51CFDE');
      context.fillStyle = grd;
      context.fill();

      //badge
      const badge = AWResourceManager.getInstance().resources('gage_badge_offImg');
      context.drawImage(badge, bageX, bageY);
    }, (err) => {
      console.log('not found local first');
    });

  }

  onStart(data?: any) {
    this.x = 20;
    this.y = 20;
    this.beforeHeadsetConcentration = 0;
    this.headsetConcentration = 0;
    this.accelerationStep = new PointVector(0.2, 0.2, 0);
    this.acceleration = new PointVector(0, 0);
    this.velocity = new PointVector(0, 0);
    //집중도
    console.log('--score id- ' + this.id);
    // this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).subscribe( (room: Room<Algo>) => {
    //   this.room = room;
    // });
    this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).filter( (it) => !ValidUtil.isNullOrUndefined(it.local) && !ValidUtil.isNullOrUndefined(it.other)).subscribe( (room: Room<Algo>) => {
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

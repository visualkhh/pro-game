import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';
import {Info} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/info/Info';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStage} from '../../stage/DroneStage';
import {DroneStageGame} from '../../stage/DroneStageGame';
import {DroneStageEvent} from '../../stage/DronStageEvent';
import {ObjDrone} from '../ObjDrone';

export class Score extends ObjDrone {

  private velocity: PointVector;
  private acceleration: PointVector;
  private accelerationStep: PointVector;
  private resizeSubscription: Subscription;
  private concentrationSubscription: Subscription;
  private beforeHeadsetConcentration = 0;
  private headsetConcentration = 0;
  private finishCnt = Info.FINISH_CNT;
  private roomDetailSubscription: Subscription;
  private status: string;
  private _showBadge = true;

  constructor(stage: DroneStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    let headsetConcentration = this.status === 'run' || this.status === 'end' ? this.headsetConcentration : 0;
    headsetConcentration = Math.min(9, headsetConcentration);
    // context.translate(50, 50);
    // context.scale(0.7, 0.7);
    const bageX = 20;
    const bageY = 20;
    const gageBg = DroneResourceManager.getInstance().resources('gage_bgImg');
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
    const stepVal = (scoreWidth) / 9;
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
    context.beginPath();
    const fontPT = 18;
    context.font = 'bold ' + fontPT + 'pt Multicolore';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#FFFFFF';
    context.lineWidth = 2;
    context.fillText(headsetConcentration.toLocaleString(), gageBgCenterX, gageBgCenterY);

    if (this.showBadge) {
      //badge
      let badge = DroneResourceManager.getInstance().resources('gage_badge_offImg');
      if (this.finishCnt <= 0 && headsetConcentration >= 9) {
        badge = DroneResourceManager.getInstance().resources('gage_badge_onImg');
      }
      context.drawImage(badge, bageX, bageY);
    }
  }

  onStart(data?: any) {
    this.x = 20;
    this.y = 20;
    this.finishCnt = Info.FINISH_CNT;
    this.beforeHeadsetConcentration = 0;
    this.headsetConcentration = 0;
    this.accelerationStep = new PointVector(0.2, 0.2, 0);
    this.acceleration = new PointVector(0, 0);
    this.velocity = new PointVector(0, 0);
    //집중도
    console.log('--score id- ' + this.id);
    this.roomDetailSubscription = this.stage.eventObservable(DroneStageEvent.EVENT_ROOM_DETAIL).subscribe( (room: Room<any>) => {
      this.status = room.status;
    });
    this.concentrationSubscription = this.stage.eventObservable(DroneStageEvent.EVENT_CONCENTRATION).filter( (it) => this.id === it.uuid).subscribe( (concentration) => {
      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration.headsetConcentration || 0;
      const history = concentration.headsetConcentrationHistory || new Array<number>();
      history.forEach( (it) => it >= 9 ? this.finishCnt-- : this.finishCnt = Info.FINISH_CNT);
      // this.score += Number(concentration.headsetConcentration);
      // if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
      //   DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {score: this.score}));
      // }
    });

  }

  onStop(data?: any) {
    // if (!ValidUtil.isNullOrUndefined(this.pointSubscription)) {this.pointSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
  }

  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

  get showBadge(): boolean {
    return this._showBadge;
  }

  set showBadge(value: boolean) {
    this._showBadge = value;
  }
}

import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWObj} from '../AWObj';

export class WigMan extends AWObj {
  private velocity: PointVector;
  private roomDetailSubscription: Subscription;
  private room: Room;
  private head_02Img = AWResourceManager.getInstance().resources('head_02Img');

  constructor(stage: AWStage, img: HTMLImageElement, order = 0) {
    super(stage, 0, 0, 0, img);
    this.imgAlign = 'center';
    this.imgBaseline = 'hanging';
  }


  onDraw(context: CanvasRenderingContext2D): void {
    const stepSize = ((this.stage.height / 2) / 10);// - (this.img.height / 2);
    const targetPosition = new PointVector(this.stage.width / 2, this.stage.height / 2);
    if (!ValidUtil.isNullOrUndefined(this.room) && this.room.other.successHistory.length >= 0) {
      targetPosition.y = (this.stage.height / 2) - (stepSize * Math.min(10, this.room.other.successHistory.length));
    } else {
      targetPosition.y = this.stage.height / 2;
    }

    //targetPosition
    //////update
    const dir = PointVector.sub(targetPosition, this);
    dir.normalize();
    dir.mult(1.5);
    this.velocity.add(dir);
    this.velocity.limit(5);
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
    if (!ValidUtil.isNullOrUndefined(this.room) && this.room.other.successHistory.length >= 10) {
      this.drawImage(context, this.head_02Img, this.x, this.y);
    }else {
      this.drawImage(context, this.img, this.x, this.y);
    }
  }

  onStart(data?: any) {
    this.velocity = new PointVector(0, 0);
    this.set(this.stage.width / 2, (this.stage.height / 2), 0);
    this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).filter( (it) => !ValidUtil.isNullOrUndefined(it.local) && !ValidUtil.isNullOrUndefined(it.other) ).subscribe( (room: Room) => {
      this.room = room;
    });
  }

  onStop() {
    // if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

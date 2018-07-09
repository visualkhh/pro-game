import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWObj} from '../AWObj';

export class Fan extends AWObj {
  private velocity: PointVector;
  private roomDetailSubscription: Subscription;
  private room: Room;
  private stepSize = 30;
  private _order;

  constructor(stage: AWStage,img: HTMLImageElement, order = 0) {
    super(stage, 0, 0, 0, img);
    this.imgAlign = 'center';
    this.imgBaseline = 'middle';
    this._order = order;
  }

  get order(): number {
    return this._order;
  }

  set order(value: number) {
    this._order = value;
  }

  onDraw(context: CanvasRenderingContext2D): void {
    // context.drawImage(this.img, (this.stage.width / 2) - (this.img.width / 2) , this.stage.height / 2 - (this.img.height / 2));

    const x = ((this.stage.width / 5) * (this.order > 5 ? this.order - 5 : this.order)) - (this.img.width / 2);
    const y = (this.stage.height / 2) + (this.order > 5 ? this.img.height : 0);
    context.translate(x, y);

    // context.translate(50 * this._order, this.stage.height / 2);
    // console.log('---' + this._order);
    if (!ValidUtil.isNullOrUndefined(this.room) && this.room.other.successHistory.length >= this.order) {
      this.mass += this.stepSize;
    } else {
      this.mass = 0;
    }
    this.drawRotate(context, (c) => {
      this.drawImage(context, this.img, this.x, this.y);
    }, this.x, this.y, this.mass);
  }

  onStart(data?: any) {
    this.velocity = new PointVector(0, 0);
    this.mass = 0;
    this.set(0, 0, 0);

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

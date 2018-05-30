import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStage} from '../../stage/DroneStage';
import {DroneStageGame} from '../../stage/DroneStageGame';
import {DroneStageEvent} from '../../stage/DronStageEvent';
import {ObjDrone} from '../ObjDrone';

export class Alarm extends ObjDrone {

  private roomDetailSubscription: Subscription;
  private endCnt: number;

  constructor(stage: DroneStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {

    if (this.endCnt <= 60) {
      const fontPT = 20;
      context.save();
      const width = context.measureText('show me the money 123,456').width;
      context.font = fontPT + 'pt Multicolore';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#020f1c';
      context.lineWidth = 0;
      if (this.endCnt < 10) {
        context.translate((this.endCnt % 2) * 5, 0);
      }
      context.drawImage(this.img, this.stage.width - this.img.width - 10 , this.y + (this.img.height) + 10);
      context.fillText(String(this.endCnt), this.stage.width - (this.img.width / 2) - 10, this.y + (this.img.height) + (this.img.height / 2) + 12);
      context.restore();
    }
  }

  onStart(data?: any) {
    this.endCnt = 60;
    this.x = 20;
    this.y = 20;
    //집중도
    console.log('--alarm id- ' + this.id);
    this.roomDetailSubscription = this.stage.eventObservable(DroneStageEvent.EVENT_ROOM_DETAIL).filter( (it: Room<any>) => it.status === 'run').subscribe( (room) => {
      this.endCnt = room.endCnt;
    });
  }

  onStop(data?: any) {
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

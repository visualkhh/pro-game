import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {Info} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/info/Info';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWObj} from '../AWObj';

export class Alarm extends AWObj {

  private roomDetailSubscription: Subscription;
  private endCnt: number;
  constructor(stage: AWStage, x: number, y: number, z: number, img: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {

    if (this.endCnt <= Info.END_CNT) {
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
    this.endCnt = Info.END_CNT;
    this.x = 20;
    this.y = 20;
    //집중도
    console.log('--alarm id- ' + this.id);
    this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).filter( (it: Room) => it.status === 'run').subscribe( (room) => {
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

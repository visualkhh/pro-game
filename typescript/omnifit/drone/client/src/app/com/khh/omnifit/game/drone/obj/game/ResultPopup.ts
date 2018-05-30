import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';
import {CollectionUtil} from '../../../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../../DroneResourceManager';
import {DroneStageManager} from '../../DroneStageManager';
import {DroneStage} from '../../stage/DroneStage';
import {DroneStageEvent} from '../../stage/DronStageEvent';
import {ObjDrone} from '../ObjDrone';

export interface UserResult {
  uuid: string;
  host: string;
  rank: number;
  score: number;
}

export class ResultPopup extends ObjDrone {
  // private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private accelerationStep: PointVector;
  private result_popup_bgImg = DroneResourceManager.getInstance().resources('result_popup_bgImg');
  private result_characterImg = DroneResourceManager.getInstance().resources('result_characterImg');
  private ranking_character_01Img = DroneResourceManager.getInstance().resources('ranking_character_01Img');
  private ranking_icon_01Img = DroneResourceManager.getInstance().resources('ranking_icon_01Img');
  private ranking_icon_02Img = DroneResourceManager.getInstance().resources('ranking_icon_02Img');
  private ranking_icon_03Img = DroneResourceManager.getInstance().resources('ranking_icon_03Img');
  private ranking_shape_01Img = DroneResourceManager.getInstance().resources('ranking_shape_01Img');
  private roomDetailSubscription: Subscription;
  private targetPosition: PointVector;
  private hostResult: UserResult;
  private hitArea: Rect;
  private mousedownSubscription: Subscription;
  private userResults: UserResult[];

  constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    if (ValidUtil.isNullOrUndefined(this.targetPosition)) {
      return;
    }
    if (ValidUtil.isNullOrUndefined(this.hostResult)) {
      return;
    }

    //////update
    //방향
    const dir = PointVector.sub(this.targetPosition, this);
    const mag = dir.mag();
    dir.normalize();
    dir.mult(this.accelerationStep);
    // dir.mult(0.2);
    this.acceleration = dir; //가속도
    const oldVelocity = this.velocity.get();
    this.velocity.add(this.acceleration); //속도
    const oldPosition = this.get();
    this.add(this.velocity);
    const oldCheck = PointVector.sub(oldPosition, this.targetPosition);
    const check = PointVector.sub(this, this.targetPosition);
    if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
      this.x = this.targetPosition.x;
      this.velocity.x = 0;
    }
    if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
      this.y = this.targetPosition.y;
      this.velocity.y = 0;
    }

    // context.textAlign = 'center';
    // context.textBaseline = 'middle';

    const popup_x = this.x - (this.result_popup_bgImg.width / 2);
    const popup_y = this.y - (this.result_popup_bgImg.height / 2);
    const character_x = this.x - (this.result_characterImg.width / 2);
    const character_y = this.y - (this.result_characterImg.height / 2) - 125;
    context.drawImage(this.result_popup_bgImg, popup_x, popup_y);
    this.hitArea = new Rect(popup_x, popup_y, popup_x + this.result_popup_bgImg.width, popup_y + this.result_popup_bgImg.height);
    context.drawImage(this.result_characterImg, character_x, character_y);

    if (!ValidUtil.isNullOrUndefined(this.hostResult)) {
      context.save();
      let fontPT = 40;
      context.strokeStyle = '#392B25';
      // context.shadowColor = '#000000';
      // context.shadowOffsetX = -1;
      // context.shadowOffsetY = -1;
      context.font = fontPT + 'pt Multicolore';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#FFFFFF';
      context.lineWidth = 2;
      context.fillText(this.hostResult.score.toLocaleString(), this.x, this.y - 5);
      context.strokeText(this.hostResult.score.toLocaleString(), this.x, this.y - 5);
      // fontPT = 18;
      // context.font = 'bold  ' + fontPT + 'pt Multicolore';
      // context.textAlign = 'center';
      // context.textBaseline = 'middle';
      // context.fillStyle = '#F9DFD4';
      // context.lineWidth = 1;
      // // console.log(this.hostResult)
      // context.fillText('내등수 : ' + this.hostResult.rank.toLocaleString() + '등', this.x, this.y + 13);
      // context.strokeText('내등수 : ' + this.hostResult.rank.toLocaleString() + '등', this.x, this.y + 13);
      context.restore();
      const hostRankImg = this.getRankImg(this.hostResult.rank);
      const hostRank_x = this.x - (hostRankImg.width / 2) - 75;
      const hostRank_y = this.y - (hostRankImg.height / 2) - 2;
      context.drawImage(hostRankImg, hostRank_x, hostRank_y);

      const userResults = this.userResults || new Array<UserResult>() ;
      //console.log(userResults);
      const wjumpSize = (this.result_popup_bgImg.width - 65) / (userResults.length + 1);
      let wjump = 0;
      // popup_x
      // popup_y
      userResults.forEach( (it) => {
        // const hostRank_x = this.x - (hostRankImg.width / 2) - 75;
        // const hostRank_y = this.y - (hostRankImg.height / 2) - 2;
        wjump += wjumpSize;
        //console.log(wjump);
        context.drawImage(this.ranking_shape_01Img, popup_x + wjump, popup_y + 322);
        context.drawImage(this.ranking_character_01Img, popup_x + wjump  + 20, popup_y + 322 + 3);
        context.drawImage(this.getRankImg(it.rank), popup_x + wjump - 3, popup_y + 322 - 3);

        context.save();
        // context.strokeStyle = '#392B25';
        // context.shadowColor = '#000000';
        // context.shadowOffsetX = -1;
        // context.shadowOffsetY = -1;
        fontPT = 10;
        context.font = fontPT + 'pt Multicolore';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#FFFFFF';
        // context.lineWidth = 1;
        context.fillText(it.score.toLocaleString(), popup_x + wjump + 36, popup_y + 322 + 51);
        // context.strokeText(it.score.toLocaleString(), popup_x + wjump + 36, popup_y + 322 + 51);
        context.restore();
      });
      //context.strokeRect(this.hitArea.left, this.hitArea.top, this.hitArea.width(), this.hitArea.height());
    }

  }

  private getRankImg(rank: number): HTMLImageElement {
    let hostRankImg = this.ranking_icon_01Img;
    if (rank === 1) {
      hostRankImg = this.ranking_icon_01Img;
    } else if (rank === 2) {
      hostRankImg = this.ranking_icon_02Img;
    } else {
      hostRankImg = this.ranking_icon_03Img;
    }
    return hostRankImg;
  }

  onStart(data?: any) {
    this.set(this.startPosition());
    this.accelerationStep = new PointVector(0.2, 0.2, 0);
    this.acceleration = new PointVector(0, 0);
    this.velocity = new PointVector(0, 0);
    this.targetPosition = undefined;
    this.hostResult = undefined;
    this.hitArea = new Rect(0, 0, 0, 0);
    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      if (!ValidUtil.isNullOrUndefined(this.hitArea) && this.hitArea.contains(event.offsetX, event.offsetY) ) {
        DroneStageManager.getInstance().goStage(1);
      }
    });
    this.roomDetailSubscription = this.stage.eventObservable(DroneStageEvent.EVENT_ROOM_DETAIL).filter( (it: Room<any>) => it.status === 'end').subscribe( (room) => {
      if (!ValidUtil.isNullOrUndefined(this.hostResult)) {
        return;
      }
      this.targetPosition = new PointVector(this.stage.width / 2 , this.stage.height / 2);
      //console.log('resultPopup');
      const userResults = new Array<UserResult>();
      for (const user of room.users) {
        const result = {uuid: user.uuid, host: user.host, score: CollectionUtil.sumArray(user.headsetConcentrationHistory || [0])} as UserResult;
        result.score = result.score || 0;
        userResults.push(result);
        if (user.host === 'host') {
          this.hostResult = result;
        }
        userResults.sort((n1, n2) => (n1.score < n2.score ? 1 : -1));
        for (let i = 0; i < userResults.length; i++) {
          userResults[i].rank = (i + 1);
        }
        //CollectionUtil.removeArrayItem(userResults, this.hostResult)
        this.userResults = userResults;
      }
    });
  }

  startPosition(): PointVector {
    return new PointVector(this.stage.width, this.stage.height / 2);
  }
  onStop() {
    console.log('resultpopup stop')
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.mousedownSubscription)) {this.mousedownSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

}

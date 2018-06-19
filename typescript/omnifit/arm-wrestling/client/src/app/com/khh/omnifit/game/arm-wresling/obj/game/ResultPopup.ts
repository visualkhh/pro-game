import {Subscription} from 'rxjs/Subscription';
import {RoomStatusCode} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/code/RoomStatusCode';
import {UserHostCode} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/code/UserHostCode';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {Info} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/info/Info';
import {CollectionUtil} from '../../../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {Rect} from '../../../../../../../../../../lib-typescript/com/khh/graphics/Rect';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../../drive/DeviceManager';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStageManager} from '../../AWStageManager';
import {AWStage} from '../../stage/AWStage';
import {ObjAW} from '../ObjAW';

export interface UserResult {
  uuid: string;
  name: string;
  host: string;
  rank: number;
  score: number;
}

export class ResultPopup extends ObjAW {
  // private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private accelerationStep: PointVector;
  private result_popup_bgImg = AWResourceManager.getInstance().resources('result_popup_bgImg');
  private ranking_icon_01Img = AWResourceManager.getInstance().resources('ranking_icon_01Img');
  private ranking_icon_02Img = AWResourceManager.getInstance().resources('ranking_icon_02Img');
  private ranking_icon_03Img = AWResourceManager.getInstance().resources('ranking_icon_03Img');
  private ranking_shape_01Img = AWResourceManager.getInstance().resources('ranking_shape_01Img');
  private ranking_shape_02Img = AWResourceManager.getInstance().resources('ranking_shape_02Img');
  private ranking_shape_02_arrowImg = AWResourceManager.getInstance().resources('ranking_shape_02_arrowImg');
  private roomDetailSubscription: Subscription;
  private targetPosition: PointVector;
  private hostResult: UserResult;
  private hitArea: Rect;
  private hitExitArea: Rect;
  private hitReStartArea: Rect;
  private mousedownSubscription: Subscription;
  private userResults: UserResult[];

  constructor(stage: AWStage, x: number, y: number, z: number, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
  }

  onDraw(context: CanvasRenderingContext2D): void {
    //////update
    this.targetPosition = new PointVector(this.stage.width / 2 , this.stage.height / 2);
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

    //draw popup background
    const popup_x = this.x - (this.result_popup_bgImg.width / 2);
    const popup_y = this.y - (this.result_popup_bgImg.height / 2) - 20;
    context.drawImage(this.result_popup_bgImg, popup_x, popup_y);
    this.hitArea = new Rect(popup_x, popup_y, popup_x + this.result_popup_bgImg.width, popup_y + this.result_popup_bgImg.height);
    this.hitExitArea = new Rect(popup_x + 20, popup_y + this.result_popup_bgImg.height - 150, popup_x + this.result_popup_bgImg.width - 185, popup_y + this.result_popup_bgImg.height);
    this.hitReStartArea = new Rect(popup_x + 180, popup_y + this.result_popup_bgImg.height - 150, popup_x + this.result_popup_bgImg.width, popup_y + this.result_popup_bgImg.height);

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
      context.fillText(this.hostResult.score.toLocaleString(), popup_x + 180, popup_y + 322);
      context.strokeText(this.hostResult.score.toLocaleString(), popup_x + 180, popup_y + 322);
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
      // const hostRankImg = this.getRankImg(this.hostResult.rank);
      // const hostRank_x = this.x - (hostRankImg.width / 2) - 75;
      // const hostRank_y = this.y - (hostRankImg.height / 2) - 2;
      // context.drawImage(hostRankImg, hostRank_x, hostRank_y);

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
        if (it.uuid === this.hostResult.uuid) {
          //result characte
          const result_characterImg = this.resultCharacte(it.name);
          const character_x = popup_x + 130;
          const character_y = popup_y + 110;
          context.drawImage(result_characterImg, character_x, character_y);
          context.drawImage(this.ranking_shape_02Img, popup_x + wjump, popup_y + 385);
        }else {
          context.drawImage(this.ranking_shape_01Img, popup_x + wjump, popup_y + 385);
        }
        context.drawImage(this.summaryCharacte(it.name), popup_x + wjump  + 20, popup_y + 385 + 3);
        context.drawImage(this.getRankImg(it.rank), popup_x + wjump - 3, popup_y + 385 - 3);
        if (it.host === 'host') {
          context.drawImage(this.ranking_shape_02_arrowImg, popup_x + wjump + 25, popup_y + 385 - 5);
        }

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
        context.fillText(it.score.toLocaleString(), popup_x + wjump + 36, popup_y + 382 + 56);
        // context.strokeText(it.score.toLocaleString(), popup_x + wjump + 36, popup_y + 322 + 51);
        context.restore();
      });
      // context.strokeRect(this.hitArea.left, this.hitArea.top, this.hitArea.width(), this.hitArea.height());
      // context.strokeRect(this.hitExitArea.left, this.hitExitArea.top, this.hitExitArea.width(), this.hitExitArea.height());
      // context.strokeRect(this.hitReStartArea.left, this.hitReStartArea.top, this.hitReStartArea.width(), this.hitReStartArea.height());
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

  onStart(room: Room<any>) {
    this.set(this.startPosition());
    this.accelerationStep = new PointVector(0.2, 0.2, 0);
    this.acceleration = new PointVector(0, 0);
    this.velocity = new PointVector(0, 0);
    this.targetPosition = undefined;
    this.hostResult = undefined;
    this.hitArea = new Rect(0, 0, 0, 0);
    this.mousedownSubscription = this.stage.canvasEventSubscribe('mousedown', (event: MouseEvent) => {
      if (!ValidUtil.isNullOrUndefined(this.hitExitArea) && this.hitExitArea.contains(event.offsetX, event.offsetY) ) {
        DeviceManager.getInstance().onDestroy();
        this.stage.onDestroy();
      }
      if (!ValidUtil.isNullOrUndefined(this.hitReStartArea) && this.hitReStartArea.contains(event.offsetX, event.offsetY) ) {
        AWStageManager.getInstance().goStage(1);
      }
    });
    //console.log('resultPopup');
    const userResults = new Array<UserResult>();
    for (const user of room.users) {
      const headsetConcentrationHistory = user.headsetConcentrationHistory || [0];
      //user Result Setting
      const result = {uuid: user.uuid, name: user.name, host: user.host, score: CollectionUtil.sumArray(headsetConcentrationHistory)} as UserResult;
      result.score = result.score || 0;
      userResults.push(result);
      if (user.host === UserHostCode.HOST) {
        this.hostResult = result;
      }
      //user ranking Setting
      userResults.sort((n1, n2) => (n1.score < n2.score ? 1 : -1));
      for (let i = 0; i < userResults.length; i++) {
        userResults[i].rank = (i + 1);
      }
    }

    // console.log('>>>>>> ' + userResults);
    if (ValidUtil.isNullOrUndefined(this.hostResult)) {
      this.hostResult = userResults[0];
    }
    //CollectionUtil.removeArrayItem(userResults, this.hostResult)
    this.userResults = userResults;
  }

  startPosition(): PointVector {
    return new PointVector(this.stage.width, this.stage.height / 2);
  }
  resultCharacte(name: string): HTMLImageElement {
    let img = AWResourceManager.getInstance().resources('result_character_03Img');
    switch (name) {
      case 'do': img = AWResourceManager.getInstance().resources('result_character_01Img'); break;
      case 'so': img = AWResourceManager.getInstance().resources('result_character_02Img'); break;
      case 'bs': img = AWResourceManager.getInstance().resources('result_character_03Img'); break;
      default: img = AWResourceManager.getInstance().resources('result_character_03Img'); break;
    }
    return img;
  }
  summaryCharacte(name: string): HTMLImageElement {
    let img = AWResourceManager.getInstance().resources('ranking_character_03Img');
    switch (name) {
      case 'do': img = AWResourceManager.getInstance().resources('ranking_character_01Img'); break;
      case 'so': img = AWResourceManager.getInstance().resources('ranking_character_02Img'); break;
      case 'bs': img = AWResourceManager.getInstance().resources('ranking_character_03Img'); break;
      default: img = AWResourceManager.getInstance().resources('ranking_character_03Img'); break;
    }
    return img;
  }
  onStop() {
    console.log('resultpopup stop');
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.mousedownSubscription)) {this.mousedownSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}
}

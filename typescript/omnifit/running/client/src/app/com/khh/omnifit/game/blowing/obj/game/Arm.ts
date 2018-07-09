import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWObj} from '../AWObj';
import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';

export class Arm extends AWObj {
  private velocity: PointVector;
  private roomDetailSubscription: Subscription;
  private room: Room;
  private percent = 50;
  private charArm1Img;
  private charArm2Img;
  private charBodyImg;
  private charFace1Img;
  private charFace2Img;
  private charFace3Img;
  private charHand1Img;
  private charHand2Img;
  private charHeadImg;
  private tableImg = AWResourceManager.getInstance().resources('stage01_tableImg');
  private playerHand1Img = AWResourceManager.getInstance().resources('player_handImg');
  private playerArm1Img = AWResourceManager.getInstance().resources('player_arm1Img');
  private playerArm2Img = AWResourceManager.getInstance().resources('player_arm2Img');
  private char_00_head = AWResourceManager.getInstance().resources('char_00_headImg');
  private char_01_head = AWResourceManager.getInstance().resources('char_01_headImg');
  private goldball = AWResourceManager.getInstance().resources('goldballImg');

  constructor(stage: AWStage, id = 'char_00') {
    super(stage);
    this.imgAlign = 'center';
    this.imgBaseline = 'middle';
    this.id = id;
    this.changeChar();
  }

  onDraw(context: CanvasRenderingContext2D): void {

    this.drawImage(context, this.tableImg, this.stage.width / 2, this.stage.height / 2);


    //targetPosition
    // const targetPosition = new PointVector(this.percent, 0);
    const targetPosition = new PointVector(MathUtil.getValueByTotInPercent(this.stage.width, this.percent), this.stage.height / 2);
    //////update
    //방향
    const dir = PointVector.sub(targetPosition, this);
    dir.normalize();
    dir.mult(5);
    this.velocity.add(dir);
    this.velocity.limit(4);
    const oldPosition = this.get();
    this.add(this.velocity);
    const oldCheck = PointVector.sub(oldPosition, targetPosition);
    const check = PointVector.sub(this, targetPosition);
    // if (oldCheck.x <= 0 && check.x > 0 || oldCheck.x >= 0 && check.x < 0) {
    //   this.x = targetPosition.x;
    //   this.velocity.x = 0;
    // }
    // if (oldCheck.y <= 0 && check.y > 0 || oldCheck.y >= 0 && check.y < 0) {
    //   this.y = targetPosition.y;
    //   this.velocity.y = 0;
    // }
    // this.drawRotate(context, (c)  => {
    //   this.drawImage(c, this.playerArm2Img, playerArm2Position.x, playerArm2Position.y, 'center', 'bottom');
    // }, playerArm2Position.x, playerArm2Position.y, (-20)  - (this.x - 50));
    //
    // this.drawRotate(context, (c)  => {
    //   this.drawImage(context, this.charArm2Img, arm2Position.x, arm2Position.y, 'center', 'bottom');
    // }, arm2Position.x, arm2Position.y, 20 - (this.x - 50));
    let otherX = this.stage.width / 2;
    if (this.x >= this.stage.width / 2) {
      otherX -= (this.x - otherX);
    }else {
      otherX += (otherX - this.x);
    }
    this.drawImage(context, this.char_00_head, otherX, this.stage.height / 2 - 150, 'center', 'middle');
    this.drawImage(context, this.char_01_head, this.x, this.stage.height / 2 + 150,  'center', 'middle');
    this.drawImage(context, this.goldball, this.x, this.y);
    console.log('per:' + this.percent);
  }

  onStart(data?: any) {
    console.log('drone start id ' + this.id);
    this.changeChar();
    this.velocity = new PointVector(0, 0);
    this.set(this.stage.width / 2, this.stage.height / 2, 0);
    this.roomDetailSubscription = this.stage.eventObservable(AWStageEvent.EVENT_ROOM_DETAIL).filter( (it) => !ValidUtil.isNullOrUndefined(it.local) && !ValidUtil.isNullOrUndefined(it.other) ).subscribe( (room: Room) => {
      this.room = room;
      // console.log(this.room.local.headsetConcentration + ' ----- ' + this.room.other.headsetConcentration)
      if (this.room.local.headsetConcentration > this.room.other.headsetConcentration) {
        this.percent = Math.min(100, this.percent += 10);
      }else if (this.room.local.headsetConcentration < this.room.other.headsetConcentration) {
        this.percent = Math.max(0, this.percent -= 10);
      }else {
      }
    });
  }

  onStop() {
    if (!ValidUtil.isNullOrUndefined(this.roomDetailSubscription)) {this.roomDetailSubscription.unsubscribe(); }
  }
  onCreate(data?: any) {}
  onDestroy(data?: any) {}
  onPause(data?: any) {}
  onRestart(data?: any) {}
  onResume(data?: any) {}

  public changeChar(id = this.id) {
    switch (id) {
      case 'char_00': {
        this.charArm1Img = AWResourceManager.getInstance().resources('char_00_arm1Img');
        this.charArm2Img = AWResourceManager.getInstance().resources('char_00_arm2Img');
        this.charBodyImg = AWResourceManager.getInstance().resources('char_00_bodyImg');
        this.charFace1Img = AWResourceManager.getInstance().resources('char_00_face1Img');
        this.charFace2Img = AWResourceManager.getInstance().resources('char_00_face2Img');
        this.charFace3Img = AWResourceManager.getInstance().resources('char_00_face3Img');
        this.charHand1Img = AWResourceManager.getInstance().resources('char_00_hand1Img');
        this.charHand2Img = AWResourceManager.getInstance().resources('char_00_hand2Img');
        this.charHeadImg = AWResourceManager.getInstance().resources('char_00_headImg');
        break;
      }
      case 'char_01': {
        this.charArm1Img = AWResourceManager.getInstance().resources('char_01_arm1Img');
        this.charArm2Img = AWResourceManager.getInstance().resources('char_01_arm2Img');
        this.charBodyImg = AWResourceManager.getInstance().resources('char_01_bodyImg');
        this.charFace1Img = AWResourceManager.getInstance().resources('char_01_face1Img');
        this.charFace2Img = AWResourceManager.getInstance().resources('char_01_face2Img');
        this.charFace3Img = AWResourceManager.getInstance().resources('char_01_face3Img');
        this.charHand1Img = AWResourceManager.getInstance().resources('char_01_hand1Img');
        this.charHand2Img = AWResourceManager.getInstance().resources('char_01_hand2Img');
        this.charHeadImg = AWResourceManager.getInstance().resources('char_01_headImg');
        break;
      }
      case 'char_02': {
        this.charArm1Img = AWResourceManager.getInstance().resources('char_02_arm1Img');
        this.charArm2Img = AWResourceManager.getInstance().resources('char_02_arm2Img');
        this.charBodyImg = AWResourceManager.getInstance().resources('char_02_bodyImg');
        this.charFace1Img = AWResourceManager.getInstance().resources('char_02_face1Img');
        this.charFace2Img = AWResourceManager.getInstance().resources('char_02_face2Img');
        this.charFace3Img = AWResourceManager.getInstance().resources('char_02_face3Img');
        this.charHand1Img = AWResourceManager.getInstance().resources('char_02_hand1Img');
        this.charHand2Img = AWResourceManager.getInstance().resources('char_02_hand2Img');
        this.charHeadImg = AWResourceManager.getInstance().resources('char_02_headImg');
        break;
      }
      default: {
        this.charArm1Img = AWResourceManager.getInstance().resources('char_00_arm1Img');
        this.charArm2Img = AWResourceManager.getInstance().resources('char_00_arm2Img');
        this.charBodyImg = AWResourceManager.getInstance().resources('char_00_bodyImg');
        this.charFace1Img = AWResourceManager.getInstance().resources('char_00_face1Img');
        this.charFace2Img = AWResourceManager.getInstance().resources('char_00_face2Img');
        this.charFace3Img = AWResourceManager.getInstance().resources('char_00_face3Img');
        this.charHand1Img = AWResourceManager.getInstance().resources('char_00_hand1Img');
        this.charHand2Img = AWResourceManager.getInstance().resources('char_00_hand2Img');
        this.charHeadImg = AWResourceManager.getInstance().resources('char_00_headImg');
      }
    }
  }
}

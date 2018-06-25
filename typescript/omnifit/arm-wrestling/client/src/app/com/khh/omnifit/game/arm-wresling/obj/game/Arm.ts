import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWStageEvent} from '../../stage/AWStageEvent';
import {AWObj} from '../AWObj';

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

  constructor(stage: AWStage, id = 'char_00') {
    super(stage);
    this.imgAlign = 'center';
    this.imgBaseline = 'middle';
    this.id = id;
    this.changeChar();
  }

  onDraw(context: CanvasRenderingContext2D): void {
    // if (ValidUtil.isNullOrUndefined(this.room)) {return; }

    const tablePosition = new PointVector(this.stage.width / 2, this.stage.height - (this.tableImg.height / 2));
    const bodyPosition = tablePosition.get();
    bodyPosition.sub(0, this.tableImg.height / 1.5);
    const arm1Position = bodyPosition.get();
    arm1Position.sub(this.charBodyImg.width / 3.3);
    arm1Position.add(0, 130);
    const arm2Position = bodyPosition.get();
    arm2Position.x = tablePosition.x - 120;
    arm2Position.y = tablePosition.y;

    const hand2Position = bodyPosition.get();
    hand2Position.add(this.charBodyImg.width / 3);
    hand2Position.add(0, 100);

    const headPosition = bodyPosition.get();
    headPosition.add(20);
    headPosition.sub(0, this.charBodyImg.height / 1.5);
    const facePosition = headPosition.get();
    const charFaceImg = AWResourceManager.getInstance().resources('char_00_face1Img');

    const playerHand1Position = tablePosition.get();
    playerHand1Position.sub(this.charHeadImg.width / 1.5);
    playerHand1Position.add(0, this.charHeadImg.height / 2);
    const playerArm1Position = tablePosition.get();
    playerArm1Position.add(this.charHeadImg.width / 1.5, this.charHeadImg.height / 2.5);
    const playerArm2Position = playerArm1Position.get();
    playerArm2Position.x = tablePosition.x + 120;
    playerArm2Position.y = tablePosition.y;

    this.drawImage(context, this.charBodyImg, bodyPosition.x, bodyPosition.y);
    this.drawImage(context, this.tableImg, tablePosition.x, tablePosition.y);
    this.drawImage(context, this.charHeadImg, headPosition.x, headPosition.y);
    this.drawImage(context, charFaceImg, facePosition.x, facePosition.y);
    this.drawImage(context, this.charArm1Img, arm1Position.x, arm1Position.y);
    this.drawImage(context, this.charHand2Img, hand2Position.x, hand2Position.y);
    this.drawImage(context, this.playerHand1Img, playerHand1Position.x, playerHand1Position.y);
    // this.drawImage(context, this.playerArm2Img, playerArm2Position.x, playerArm2Position.y);
    // this.drawRotateImage(context, this.playerArm2Img, playerArm2Position.x, playerArm2Position.y, 0, 'center', 'bottom');
    context.fillStyle = '#FF0000';
    context.beginPath(); context.arc(bodyPosition.x, bodyPosition.y, 5, 0, 2 * Math.PI); context.closePath(); context.fill();
    context.beginPath(); context.arc(headPosition.x, headPosition.y, 5, 0, 2 * Math.PI); context.closePath(); context.fill();
    context.beginPath(); context.arc(tablePosition.x, tablePosition.y, 5, 0, 2 * Math.PI); context.closePath(); context.fill();
    context.beginPath(); context.arc(arm2Position.x, arm2Position.y, 10, 0, 2 * Math.PI); context.closePath(); context.fill();
    context.beginPath(); context.arc(playerArm1Position.x, playerArm1Position.y, 5, 0, 2 * Math.PI); context.closePath(); context.fill();
    context.beginPath(); context.arc(playerArm2Position.x, playerArm2Position.y, 10, 0, 2 * Math.PI); context.closePath(); context.fill();
    context.beginPath(); context.arc(hand2Position.x, hand2Position.y, 5, 0, 2 * Math.PI); context.closePath(); context.fill();

    //targetPosition
    const targetPosition = new PointVector(this.percent, 0);
    //////update
    //방향
    const dir = PointVector.sub(targetPosition, this);
    dir.normalize();
    dir.mult(2);
    this.velocity.add(dir);
    this.velocity.limit(1);
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
    this.drawRotate(context, (c)  => {
      this.drawImage(c, this.playerArm2Img, playerArm2Position.x, playerArm2Position.y, 'center', 'bottom');
    }, playerArm2Position.x, playerArm2Position.y, (-20)  - (this.x - 50));

    this.drawRotate(context, (c)  => {
      this.drawImage(context, this.charArm2Img, arm2Position.x, arm2Position.y, 'center', 'bottom');
    }, arm2Position.x, arm2Position.y, 20 - (this.x - 50));

    this.drawImage(context, this.playerArm1Img, playerArm1Position.x, playerArm1Position.y);
    console.log('---' + this.percent);
  }

  onStart(data?: any) {
    console.log('drone start id ' + this.id);
    this.changeChar();
    this.velocity = new PointVector(0, 0);
    this.set(0, 0, 0);
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

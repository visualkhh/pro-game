import {Subscription} from 'rxjs/Subscription';
import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {ValidUtil} from '../../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWResourceManager} from '../../AWResourceManager';
import {AWStage} from '../../stage/AWStage';
import {AWObj} from '../AWObj';

export class Guest2 extends AWObj {

  private resizeSubscription: Subscription;
  private translatePosition: PointVector;
  private gHand1 = AWResourceManager.getInstance().resources('guest_hand1Img');
  private gHand2 = AWResourceManager.getInstance().resources('guest_hand2Img');
  private gBody = AWResourceManager.getInstance().resources('guest_bodyImg');
  private gHead = AWResourceManager.getInstance().resources('guest_head2Img');

  private gHand1Position = new PointVector(25, 150);
  private gBodyPosition = new PointVector(100, 200);
  private gHand2Position = new PointVector(170, 150);
  private gHeadPosition = new PointVector(100, 80);

  private gHand1Velocity: PointVector;
  private gHand2Velocity: PointVector;
  private gBodyVelocity: PointVector;
  private gHeadVelocity: PointVector;

  private gap = 10;
  private gHand1Idx = 1;
  private gHand1Map = [
    this.gHand1Position.get(),
    new PointVector(this.gHand1Position.x - (this.gap * 1), this.gHand1Position.y + (this.gap * 0)),
    new PointVector(this.gHand1Position.x + (this.gap * 0), this.gHand1Position.y - (this.gap * 1)),
    new PointVector(this.gHand1Position.x + (this.gap * 1), this.gHand1Position.y + (this.gap * 0)),
    new PointVector(this.gHand1Position.x + (this.gap * 0), this.gHand1Position.y + (this.gap * 1)),
  ];
  private gHand1TargetPosition = this.gHand1Map[this.gHand1Idx];

  private gHand2Idx = 1;
  private gHand2Map = [
    this.gHand2Position.get(),
    new PointVector(this.gHand2Position.x + (this.gap * 0), this.gHand2Position.y - (this.gap * 1)),
    new PointVector(this.gHand2Position.x + (this.gap * 1), this.gHand2Position.y + (this.gap * 0)),
    new PointVector(this.gHand2Position.x + (this.gap * 0), this.gHand2Position.y + (this.gap * 1)),
    new PointVector(this.gHand2Position.x - (this.gap * 1), this.gHand2Position.y + (this.gap * 0)),
  ];
  private gHand2TargetPosition = this.gHand2Map[this.gHand2Idx];

  private gBodyIdx = 1;
  private gBodyMap = [
    this.gBodyPosition.get(),
    new PointVector(this.gBodyPosition.x + (this.gap * 0), this.gBodyPosition.y + (this.gap * 1)),
    new PointVector(this.gBodyPosition.x - (this.gap * 1), this.gBodyPosition.y + (this.gap * 0)),
    new PointVector(this.gBodyPosition.x + (this.gap * 0), this.gBodyPosition.y - (this.gap * 1)),
    new PointVector(this.gBodyPosition.x + (this.gap * 1), this.gBodyPosition.y + (this.gap * 0)),
  ];
  private gBodyTargetPosition = this.gBodyMap[this.gBodyIdx];

  private gHeadIdx = 1;
  private gHeadMap = [
    this.gHeadPosition.get(),
    new PointVector(this.gHeadPosition.x + (this.gap * 0), this.gHeadPosition.y + (this.gap * 1)),
    new PointVector(this.gHeadPosition.x + (this.gap * 0), this.gHeadPosition.y - (this.gap * 1)),
    new PointVector(this.gHeadPosition.x - (this.gap * 1), this.gHeadPosition.y + (this.gap * 0)),
    new PointVector(this.gHeadPosition.x + (this.gap * 1), this.gHeadPosition.y + (this.gap * 0)),
  ];
  private gHeadTargetPosition = this.gHeadMap[this.gHeadIdx];

  constructor(stage: AWStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement) {
    super(stage, x, y, z, img);
    this.imgAlign = 'center';
    this.imgBaseline = 'middle';
  }

  onDraw(context: CanvasRenderingContext2D): void {
    context.translate(this.translatePosition.x, this.translatePosition.y);
    //////update
    //몸
    const bodyDir = PointVector.sub(this.gBodyTargetPosition, this.gBodyPosition);
    bodyDir.normalize();
    bodyDir.mult(0.7);
    this.gBodyVelocity.add(bodyDir);
    this.gBodyVelocity.limit(10);
    const bodyOldPosition = this.gBodyPosition.get();
    this.gBodyPosition.add(this.gBodyVelocity);
    // console.log(this.gBodyTargetPosition + ' 2 ' + this.gBodyPosition);
    const bodyOldCheck = PointVector.sub(bodyOldPosition, this.gBodyTargetPosition);
    const bodyCheck = PointVector.sub(this.gBodyPosition, this.gBodyTargetPosition);
    if (bodyOldCheck.x <= 0 && bodyCheck.x > 0 || bodyOldCheck.x >= 0 && bodyCheck.x < 0) {
      this.gBodyPosition.x = this.gBodyTargetPosition.x;
      this.gBodyVelocity.x = 0;
    }
    if (bodyOldCheck.y <= 0 && bodyCheck.y > 0 || bodyOldCheck.y >= 0 && bodyCheck.y < 0) {
      this.gBodyPosition.y = this.gBodyTargetPosition.y;
      this.gBodyVelocity.y = 0;
    }
    if (this.gBodyPosition.x === this.gBodyTargetPosition.x && this.gBodyPosition.y === this.gBodyTargetPosition.y) {
        this.gBodyIdx++;
        this.gBodyIdx = (this.gBodyIdx + 1 > this.gBodyMap.length ? 0 : this.gBodyIdx);
        this.gBodyTargetPosition = this.gBodyMap[this.gBodyIdx];
    }
    this.drawImage(context, this.gBody, this.gBodyPosition.x, this.gBodyPosition.y);
    context.beginPath();
    context.fillStyle = '#FF0000';
    context.fill();
    // for (const it of this.gBodyMap) {
    //   context.beginPath();
    //   context.arc(it.x, it.y, 5, 0, 2 * Math.PI);
    //   context.fill();
    // }
    // context.beginPath();
    // context.arc(this.gBodyPosition.x, this.gBodyPosition.y, 10, 0, 2 * Math.PI);
    // context.fill();

    //머리
    const headDir = PointVector.sub(this.gHeadTargetPosition, this.gHeadPosition);
    headDir.normalize();
    headDir.mult(0.7);
    this.gHeadVelocity.add(headDir);
    this.gHeadVelocity.limit(10);
    const headOldPosition = this.gHeadPosition.get();
    this.gHeadPosition.add(this.gHeadVelocity);
    const headOldCheck = PointVector.sub(headOldPosition, this.gHeadTargetPosition);
    const headCheck = PointVector.sub(this.gHeadPosition, this.gHeadTargetPosition);
    if (headOldCheck.x <= 0 && headCheck.x > 0 || headOldCheck.x >= 0 && headCheck.x < 0) {
      this.gHeadPosition.x = this.gHeadTargetPosition.x;
      this.gHeadVelocity.x = 0;
    }
    if (headOldCheck.y <= 0 && headCheck.y > 0 || headOldCheck.y >= 0 && headCheck.y < 0) {
      this.gHeadPosition.y = this.gHeadTargetPosition.y;
      this.gHeadVelocity.y = 0;
    }
    if (this.gHeadPosition.x === this.gHeadTargetPosition.x && this.gHeadPosition.y === this.gHeadTargetPosition.y) {
      this.gHeadIdx++;
      this.gHeadIdx = (this.gHeadIdx + 1 > this.gHeadMap.length ? 0 : this.gHeadIdx);
      this.gHeadTargetPosition = this.gHeadMap[this.gHeadIdx];
    }
    this.drawImage(context, this.gHead, this.gHeadPosition.x, this.gHeadPosition.y);
    context.fillStyle = '#FFF000';
    context.beginPath();
    context.fill();
    // for (const it of this.gHeadMap) {
    //   context.beginPath();
    //   context.arc(it.x, it.y, 5, 0, 2 * Math.PI);
    //   context.fill();
    // }
    // context.beginPath();
    // context.arc(this.gHeadPosition.x, this.gHeadPosition.y, 10, 0, 2 * Math.PI);
    // context.fill();

    //손1
    const hand1Dir = PointVector.sub(this.gHand1TargetPosition, this.gHand1Position);
    hand1Dir.normalize();
    hand1Dir.mult(0.7);
    this.gHand1Velocity.add(hand1Dir);
    this.gHand1Velocity.limit(10);
    const hand1OldPosition = this.gHand1Position.get();
    this.gHand1Position.add(this.gHand1Velocity);
    const hand1OldCheck = PointVector.sub(hand1OldPosition, this.gHand1TargetPosition);
    const hand1Check = PointVector.sub(this.gHand1Position, this.gHand1TargetPosition);
    if (hand1OldCheck.x <= 0 && hand1Check.x > 0 || hand1OldCheck.x >= 0 && hand1Check.x < 0) {
      this.gHand1Position.x = this.gHand1TargetPosition.x;
      this.gHand1Velocity.x = 0;
    }
    if (hand1OldCheck.y <= 0 && hand1Check.y > 0 || hand1OldCheck.y >= 0 && hand1Check.y < 0) {
      this.gHand1Position.y = this.gHand1TargetPosition.y;
      this.gHand1Velocity.y = 0;
    }
    if (this.gHand1Position.x === this.gHand1TargetPosition.x && this.gHand1Position.y === this.gHand1TargetPosition.y) {
      this.gHand1Idx++;
      this.gHand1Idx = (this.gHand1Idx + 1 > this.gHand1Map.length ? 0 : this.gHand1Idx);
      this.gHand1TargetPosition = this.gHand1Map[this.gHand1Idx];
    }
    this.drawImage(context, this.gHand1, this.gHand1Position.x, this.gHand1Position.y);
    context.fillStyle = '#FFFF00';
    context.beginPath();
    context.fill();
    // for (const it of this.gHand1Map) {
    //   context.beginPath();
    //   context.arc(it.x, it.y, 5, 0, 2 * Math.PI);
    //   context.fill();
    // }
    // context.beginPath();
    // context.arc(this.gHand1Position.x, this.gHand1Position.y, 10, 0, 2 * Math.PI);
    // context.fill();

    //손2
    const hand2Dir = PointVector.sub(this.gHand2TargetPosition, this.gHand2Position);
    hand2Dir.normalize();
    hand2Dir.mult(0.7);
    this.gHand2Velocity.add(hand2Dir);
    this.gHand2Velocity.limit(10);
    const hand2OldPosition = this.gHand2Position.get();
    this.gHand2Position.add(this.gHand2Velocity);
    const hand2OldCheck = PointVector.sub(hand2OldPosition, this.gHand2TargetPosition);
    const hand2Check = PointVector.sub(this.gHand2Position, this.gHand2TargetPosition);
    if (hand2OldCheck.x <= 0 && hand2Check.x > 0 || hand2OldCheck.x >= 0 && hand2Check.x < 0) {
      this.gHand2Position.x = this.gHand2TargetPosition.x;
      this.gHand2Velocity.x = 0;
    }
    if (hand2OldCheck.y <= 0 && hand2Check.y > 0 || hand2OldCheck.y >= 0 && hand2Check.y < 0) {
      this.gHand2Position.y = this.gHand2TargetPosition.y;
      this.gHand2Velocity.y = 0;
    }
    if (this.gHand2Position.x === this.gHand2TargetPosition.x && this.gHand2Position.y === this.gHand2TargetPosition.y) {
      this.gHand2Idx++;
      this.gHand2Idx = (this.gHand2Idx + 1 > this.gHand2Map.length ? 0 : this.gHand2Idx);
      this.gHand2TargetPosition = this.gHand2Map[this.gHand2Idx];
    }
    this.drawImage(context, this.gHand2, this.gHand2Position.x, this.gHand2Position.y);
    context.fillStyle = '#FFFFF0';
    context.beginPath();
    context.fill();
    // for (const it of this.gHand2Map) {
    //   context.beginPath();
    //   context.arc(it.x, it.y, 5, 0, 2 * Math.PI);
    //   context.fill();
    // }
    // context.beginPath();
    // context.arc(this.gHand2Position.x, this.gHand2Position.y, 10, 0, 2 * Math.PI);
    // context.fill();
    // context.drawImage(this.gHead, this.gHeadPosition.x, this.gHeadPosition.y);
    // context.drawImage(this.gHand1, this.gHand1Position.x, this.gHand1Position.y);
    // context.drawImage(this.gHand2, this.gHand2Position.x, this.gHand2Position.y);

    //checkEdges
    if (this.x > this.stage.width) {
      this.initSetting();
    }

  }

  onCreate(data?: any) {
  }

  onDestroy(data?: any) {
  }

  onPause(data?: any) {
  }

  onRestart(data?: any) {
  }

  onResume(data?: any) {
  }

  onStart(data?: any) {
    this.initSetting();
    this.resizeSubscription = this.stage.canvasEventSubscribe('resize', (event: Event) => this.initSetting());
  }

  onStop(data?: any) {
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
  }

  initSetting() {
    this.gHand1Velocity = new PointVector(0, 0);
    this.gHand2Velocity = new PointVector(0, 0);
    this.gBodyVelocity = new PointVector(0, 0);
    this.gHeadVelocity = new PointVector(0, 0);
    this.translatePosition = new PointVector((this.stage.width / 2) - 100, 0);
  }
}

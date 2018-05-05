import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
// import { Point } from '../org/Point';
// import * as abc from 'assert/js/processing.js';
export class Drone extends ObjDrone {


  private movePoint: Point;
  private maxPoint: Point;
  private stepSize: Point;
  private beforeIntent: Intent<number>;
  private intent: Intent<number>;

  constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';

    this.movePoint = new Point(0, 0, 0);
    this.maxPoint = new Point(0, 0, 0);
    this.stepSize = new Point(0, 0, 0);

  }



  onStart() {
    super.onStart();
    // Inital starting position
    // this.maxPoint.x = this.img.width/15;
    // this.maxPoint.y = this.img.height/15;
    this.maxPoint.x = 2;
    this.maxPoint.y = 3;
    this.movePoint.x = 0;
    this.movePoint.y = 0;

    // this.stepSize.x = this.img.width/200;
    this.stepSize.x = 0.5;
    this.stepSize.y = this.stepSize.x;
    // this.stepSize.y = this.img.height/100;
    console.log('stepSize:' + this.stepSize.x + ',' + this.stepSize.y + '   maxPoint:' + this.maxPoint.x + ' , ' + this.maxPoint.y );
  }

  onDraw(): void {

    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const imgCenterX = this.img.width / 2;
    const imgCenterY = this.img.height / 2;

    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');




    if (this.beforeIntent && this.intent){
      this.maxPoint.x -= (this.beforeIntent.data * 4);
      this.maxPoint.x += (this.intent.data * 4);


      context.font = '30pt Calibri';
      context.textAlign = 'center';
      context.fillStyle = 'red';
      //console.log(this.canvas.width+"     "+height)
      // context.fillText('********GAME********', x, y);
      context.fillStyle = 'blue';
      //console.log(this.canvas.width+"     "+height)
      context.fillText('con(' + this.intent.name + '):' + this.intent.data, 50, 50);
    }


    if (this.movePoint.x <= 0 && Math.abs(this.movePoint.x) >= this.maxPoint.x){
      this.stepSize.x = Math.abs(this.stepSize.x);
    }else if (this.movePoint.x >= this.maxPoint.x){
      this.stepSize.x = -this.stepSize.x;
    }
    if (this.movePoint.y <= 0 && Math.abs(this.movePoint.y) >= this.maxPoint.y){
      this.stepSize.y = Math.abs(this.stepSize.y);
    }else if (this.movePoint.y >= this.maxPoint.y){
      this.stepSize.y = -this.stepSize.y;
    }

    this.movePoint.x += this.stepSize.x;
    this.movePoint.y += this.stepSize.y;
    console.log('X >>  movePoint:' + this.movePoint.x + ' max:' + this.maxPoint.x + '  stepSize:' + this.stepSize.x + '  Y >>  movePoint:' + this.movePoint.y + ' max:' + this.maxPoint.y + '  stepSize:' + this.stepSize.y);
    // this.movePoint.y += this.stepSize.y;
    //   this.movePoint.x += this.stepSize;
    // }else if(this.movePoint.x>0 && Math.abs(this.movePoint.x)>=this.maxPoint.x){
    //   this.movePoint.x -= this.stepSize;
    // }
    //
    // if(this.movePoint.y>=this.maxPoint.y){
    //   this.movePoint.y -= this.stepSize;
    // }else if(this.movePoint.y<=this.maxPoint.y){
    //   this.movePoint.y += this.stepSize;
    // }

    const lastX = (x - imgCenterX) + this.movePoint.x;
    const lastY = (y - imgCenterY) + this.movePoint.y;
    context.drawImage(this.img, lastX, lastY);


    /*
      무게(weight) 와 질량(mass)
      물체의 질량은 물체에 포함되어 있는 물질의 양입니다. (킬로그램 단위로 측정합니다.)
      질량과 혼동되는 무게는 사실 물체에 작용하는 중력의 힘을 말합니다. 뉴턴의 제 2 법칙에 따라 질량 곱하기 중력 가속도 (w = m * g)를 통해 무게를 계산할 수 있습니다. 무게는 뉴턴 단위로 측정합니다.
     */


  }

  clockSignal(value?: any) {
    this.onDraw();
  }


  onStop() {
    super.onStop();
    console.log('Drone onStop');
  }

  intentSignal(intent: Intent<number>) {
    if (!this.beforeIntent){
      this.beforeIntent = intent;
    }else{
      this.beforeIntent = this.intent;
      this.intent = intent;
    }
  }
}

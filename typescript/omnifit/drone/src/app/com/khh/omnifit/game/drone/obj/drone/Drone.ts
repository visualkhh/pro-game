import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
export class Drone extends ObjDrone {


  //움직임 상대 누적 좌표
  private movePoint: Point;
  private maxPoint: Point;
  private velocity: Point;
  private gravity: number;

  private beforeIntent: Intent<number>;
  private intent: Intent<number>;
  private speed: number;

  constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';

    this.onStart();
  }



  onStart() {
    super.onStart();
    // Inital starting position
    this.movePoint = new Point(0, 0);
    this.maxPoint = new Point(50, 25);
    this.velocity = new Point(1, -1);
    this.speed = 1;
    this.gravity = 1;
    // console.log('stepSize:' + this.velocity.x + ',' + this.velocity.y + '   maxPoint:' + this.centerMaxPoint.x + ' , ' + this.centerMaxPoint.y );
  }

  onDraw(): void {

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const imgCenterX = this.img.width / 2;
    const imgCenterY = this.img.height / 2;
    let imgX = centerX - imgCenterX;
    let imgY = centerY - imgCenterY;
    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');






    if (this.beforeIntent && this.intent){
      // this.centerMaxPoint.centerX -= (this.beforeIntent.data * 4);
      // this.centerMaxPoint.centerX += (this.intent.data * 4);
      //imgY += (this.intent.data * 10);
      context.font = '30pt Calibri';
      context.textAlign = 'left';
      context.fillStyle = 'red';
      context.fillStyle = 'blue';
      context.fillText('con(' + this.intent.name + '):' + this.intent.data, 50, 50);
    }


    if (this.movePoint.x < 0 &&  Math.abs(this.movePoint.x) >= this.maxPoint.x){
      this.velocity.x = Math.abs(this.velocity.x);
    }else if (this.movePoint.x >= this.maxPoint.x){
      this.velocity.x = this.velocity.x * -1;
    }
    this.movePoint.x += (this.velocity.x * this.speed);


    if (this.movePoint.y < 0 &&  Math.abs(this.movePoint.y) >= this.maxPoint.y){
      this.velocity.y = Math.abs(this.velocity.y);
    }else if (this.movePoint.y >= this.maxPoint.y){
      this.velocity.y = this.velocity.y * -1;
    }
    this.movePoint.y += (this.velocity.y * this.speed);


    // this.velocity.y += this.gravity;
    // this.movePoint.y += this.gravity;

    // if (this.movePoint.y <= 0 && Math.abs(this.movePoint.y) >= this.maxPoint.y){
    //   this.velocity.y = Math.abs(this.velocity.y);
    // }else if (this.movePoint.y >= this.maxPoint.y){
    //   this.velocity.y = -this.velocity.y;
    // }
    //
    // this.movePoint.centerX += this.stepSize.x;
    // this.movePoint.centerY += this.stepSize.y;




    console.log('X >>  movePoint:' + this.movePoint.x + ' max:' + this.maxPoint.x + '  speed:' + this.speed + '  Y >>  movePoint:' + this.movePoint.y + ' max:' + this.maxPoint.y + '  speed:' + this.speed);
    //
    const lastX = imgX + this.movePoint.x;
    const lastY = imgY + this.movePoint.y;
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
      this.intent = intent;
    }else{
      this.beforeIntent = this.intent;
      this.intent = intent;
    }
  }
}

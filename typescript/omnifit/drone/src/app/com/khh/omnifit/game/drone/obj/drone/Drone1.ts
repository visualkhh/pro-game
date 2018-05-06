// import { Observable } from 'rxjs/Observable';
// import {ObjDrone} from '../ObjDrone';
// import {Intent} from '../../../../../data/Intent';
// import {Point} from '../../../../../graphics/Point';
// import {Rect} from '../../../../../graphics/Rect';
// export class Drone extends ObjDrone {
//
//
//   //움직임 상대 누적 좌표
//   private movePoint: Point;
//   private moveBoundary: Rect;
//   private velocity: Point;
//   private gravity: number;
//
//   private beforeIntent: Intent<number>;
//   private intent: Intent<number>;
//   private speed: number;
//
//   constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
//     super(x, y, z, canvas);
//     this.img = new Image();
//     this.img.src = 'assets/image/drone.png';
//
//     this.onStart();
//   }
//
//
//
//   onStart() {
//     super.onStart();
//     // Inital starting position
//     this.movePoint = new Point(0, 0);
//     this.moveBoundary = new Rect(this.getCanvasCenterX()-50, this.getCanvasCenterY()-30, this.getCanvasCenterX()+50, this.getCanvasCenterY()+30);
//     this.velocity = new Point(1, -1);
//     this.speed = 1;
//     this.gravity = 1;
//     // console.log('stepSize:' + this.velocity.x + ',' + this.velocity.y + '   maxPoint:' + this.centerMaxPoint.x + ' , ' + this.centerMaxPoint.y );
//   }
//
//   onDraw(): void {
//
//     const canvasCenterX = this.getCanvasCenterX();
//     const canvasCenterY = this.getCanvasCenterY();
//     const imgCenterX = this.getImgCenterX();
//     const imgCenterY = this.getImgCenterY();
//     let imgX = canvasCenterX - imgCenterX;
//     let imgY = canvasCenterY - imgCenterY;
//     const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
//     context.strokeStyle = '#00FF00';
//     context.fillStyle = 'blue';
//
//
//
//
//
//     if (this.beforeIntent && this.intent){
//       // this.centerMaxPoint.centerX -= (this.beforeIntent.data * 4);
//       // this.centerMaxPoint.centerX += (this.intent.data * 4);
//       //imgY += (this.intent.data * 10);
//       context.font = '30pt Calibri';
//       context.textAlign = 'left';
//       context.fillText('con(' + this.intent.name + '):' + this.intent.data, 50, 50);
//     }
//
//
//     // if (this.movePoint.x < 0 &&  Math.abs(this.movePoint.x) >= this.moveBoundary.x){
//     //   this.velocity.x = Math.abs(this.velocity.x);
//     // }else if (this.movePoint.x >= this.moveBoundary.x){
//     //   this.velocity.x = this.velocity.x * -1;
//     // }
//     // this.movePoint.x += (this.velocity.x * this.speed);
//     //
//     //
//     // if (this.movePoint.y < 0 &&  Math.abs(this.movePoint.y) >= this.moveBoundary.y){
//     //   this.velocity.y = Math.abs(this.velocity.y);
//     // }else if (this.movePoint.y >= this.moveBoundary.y){
//     //   this.velocity.y = this.velocity.y * -1;
//     // }
//     // this.movePoint.y += (this.velocity.y * this.speed);
//
//
//     // this.velocity.y += this.gravity;
//     // this.movePoint.y += this.gravity;
//
//     // if (this.movePoint.y <= 0 && Math.abs(this.movePoint.y) >= this.maxPoint.y){
//     //   this.velocity.y = Math.abs(this.velocity.y);
//     // }else if (this.movePoint.y >= this.maxPoint.y){
//     //   this.velocity.y = -this.velocity.y;
//     // }
//     //
//     // this.movePoint.centerX += this.stepSize.x;
//     // this.movePoint.centerY += this.stepSize.y;
//
//
//
//
//     // console.log('X >>  movePoint:' + this.movePoint.x + ' max:' + this.moveBoundary.x + '  speed:' + this.speed + '  Y >>  movePoint:' + this.movePoint.y + ' max:' + this.moveBoundary.y + '  speed:' + this.speed);
//     //
//     const lastX = imgX + this.movePoint.x;
//     const lastY = imgY + this.movePoint.y;
//     context.drawImage(this.img, lastX, lastY);
//     context.strokeRect(lastX, lastY, this.img.width, this.img.height);
//
//
//
//
//
//
//     //////maxBoundary
//     context.fillStyle = '#FFFF00';
//     context.strokeStyle = '#FFFF00';
//     context.beginPath();
//     context.strokeRect(2,2,this.moveBoundary.width(),this.moveBoundary.height());
//     context.arc(this.moveBoundary.centerX(), this.moveBoundary.centerY(), 20, 0, 2 * Math.PI);
//     context.fill();
//
//
//
//
//
//     //center
//     context.beginPath();
//     context.fillStyle = '#00FF00';
//     context.strokeStyle = '#00FF00';
//     context.arc(canvasCenterX, canvasCenterY, 1, 0, 2 * Math.PI);
//     // context.stroke();
//     context.fill();
//
//
//
//
//
//     /*
//       무게(weight) 와 질량(mass)
//       물체의 질량은 물체에 포함되어 있는 물질의 양입니다. (킬로그램 단위로 측정합니다.)
//       질량과 혼동되는 무게는 사실 물체에 작용하는 중력의 힘을 말합니다. 뉴턴의 제 2 법칙에 따라 질량 곱하기 중력 가속도 (w = m * g)를 통해 무게를 계산할 수 있습니다. 무게는 뉴턴 단위로 측정합니다.
//      */
//
//
//   }
//
//
//
//   clockSignal(value?: any) {
//     this.onDraw();
//   }
//
//
//   onStop() {
//     super.onStop();
//     console.log('Drone onStop');
//   }
//
//   intentSignal(intent: Intent<number>) {
//     if (!this.beforeIntent){
//       this.beforeIntent = intent;
//       this.intent = intent;
//     }else{
//       this.beforeIntent = this.intent;
//       this.intent = intent;
//     }
//   }
// }

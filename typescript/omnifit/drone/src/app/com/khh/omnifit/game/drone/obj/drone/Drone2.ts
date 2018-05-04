// import { Observable } from 'rxjs/Observable';
// import { Point } from 'app/com/khh/graphics/Point';
// import { Obj } from 'app/com/khh/obj/Obj';
// import {ObjImg} from 'app/com/khh/graphics/ObjImg';
// import {Rect} from 'app/com/khh/graphics/Rect';
// import {ObjDrone} from '../ObjDrone';
// // import { Point } from '../org/Point';
// // import * as abc from 'assert/js/processing.js';
// export class Drone2 extends ObjDrone{
//
//
//   private posX: number;
//   private posY: number;
//   private vx: number;
//   private vy: number;
//   private gravity: number;
//
//   constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
//     super(x, y, z, canvas);
//     this.img = new Image();
//     this.img.src = "assets/image/drone.png";
//   }
//
//
//
//   onStart() {
//     super.onStart();
//     // Inital starting position
//     this.posX = 20;
//     this.posY = this.canvas.height / 2;
//     this.vx = 10;
//     this.vy = -10;
//     this.gravity = 1;
//     console.log("Drone onStart pos(posX : "+this.posX+", posY : "+this.posY+" ), canvas("+this.canvas.width+","+this.canvas.height+")");
//   }
//
//   onDraw(): void {
//
//     const x = this.canvas.width / 2;
//     const y = this.canvas.height / 2;
//     let context: CanvasRenderingContext2D = this.canvas.getContext("2d");
//     context.drawImage(this.img,x - this.img.width/2, y -  this.img.height/2);
//
//
//     /*
//       무게(weight) 와 질량(mass)
//       물체의 질량은 물체에 포함되어 있는 물질의 양입니다. (킬로그램 단위로 측정합니다.)
//       질량과 혼동되는 무게는 사실 물체에 작용하는 중력의 힘을 말합니다. 뉴턴의 제 2 법칙에 따라 질량 곱하기 중력 가속도 (w = m * g)를 통해 무게를 계산할 수 있습니다. 무게는 뉴턴 단위로 측정합니다.
//      */
//
//
//
//
//
//       // Draw shapes on the canvas
//       this.posX += this.vx;
//       this.posY += this.vy;
//
//       if (this.posY > this.canvas.height * 0.75) {
//         this.vy *= -0.6;
//         this.vx *= 0.75;
//         this.posY = this.canvas.height * 0.75;
//       }
//
//       this.vy += this.gravity;
//
//       // Draw a circle particle on the canvas
//       context.beginPath();
//       context.fillStyle = "red";
//       // After setting the fill style, draw an arc on the canvas
//       context.arc(this.posX, this.posY, 10, 0, Math.PI*2, true);
//       context.closePath();
//       context.fill();
//       console.log("draw iii "+this.posX+"   "+this.posY);
//
//     // context.beginPath();
//     // context.fillStyle = "pink";
//     // context.arc(100, 100, 100, 0, Math.PI*2, true);
//     // context.closePath();
//     // context.fill();
//   }
//
//   clockSignal(value?: any) {
//     this.onDraw();
//   }
//
//
//   onStop() {
//     super.onStop();
//     console.log("Drone onStop");
//   }
// }

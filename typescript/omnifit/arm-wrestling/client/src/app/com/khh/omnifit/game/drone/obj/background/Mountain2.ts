// import {MathUtil} from '../../../../../../../../../../lib-typescript/com/khh/math/MathUtil';
// import {PointVector} from '../../../../../../../../../../lib-typescript/com/khh/math/PointVector';
// import {DroneStage} from '../../stage/DroneStage';
// import {ObjDrone} from '../ObjDrone';
// import {RandomUtil} from '../../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
//
// export class Mountain extends ObjDrone {
//   private position: PointVector;
//   private velocity: PointVector;
//   private acceleration: PointVector;
//
//   constructor(stage: DroneStage, x: number, y: number, z: number, img?: HTMLImageElement) {
//     super(stage, x, y, z, img);
//   }
//
//   onDraw(context: CanvasRenderingContext2D): void {
//     context.setTransform(1, 0, 0, 1, 0, 0);
//
//     //force
//     let force = new PointVector(0, -0.2);
//     // console.log('w' + this.position.x);
//     if (this.position.y < this.stage.height / 2) {
//       force = new PointVector(0, 0.2);
//     }
//     const f = PointVector.div(force, this.mass);
//     this.acceleration.add(f);
//
//     //update
//     if ( this.position.y < this.img.height ) {
//       this.velocity.mult(0);
//       this.acceleration.mult(0);
//     }
//     this.velocity.add(this.acceleration);
//     this.position.add(this.velocity);
//     this.acceleration.mult(0);
//     // console.log('wss' + this.position.x);
//     // console.log(this.position.y);
//     // if (this.position.y <= 20) {
//     //   this.position.y = 20;
//     // }
//     context.drawImage(this.img, this.position.x, this.position.y);
//
//     // if (this.position.x > this.stage.width) {
//     //   this.position.x = this.stage.width;
//     //   this.velocity.x *= -1;
//     // } else if (this.position.x < 0) {
//     //   this.velocity.x *= -1;
//     //   this.position.x = 0;
//     // }
//     // if (this.position.y > this.stage.height) {
//     //   this.velocity.y *= -1;
//     //   this.position.y = this.stage.height;
//     // }
//   }
//
//   onStart(data?: any) {
//     console.log('--')
//     this.mass = 1
//     this.position = new PointVector(RandomUtil.random(0, this.stage.width), this.stage.height);
//     // this.position = new PointVector(0, 0);
//     this.velocity = new PointVector(0, -1);
//     this.acceleration = new PointVector(0, 0);
//   }
//
//   onStop() {
//   }
//
//   onCreate(data?: any) {}
//   onDestroy(data?: any) {}
//   onPause(data?: any) {}
//   onRestart(data?: any) {}
//   onResume(data?: any) {}
//
//
// }

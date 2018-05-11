// import {ObjDrone} from '../ObjDrone';
// import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';
// import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/math/RandomUtil';
// import {DroneStage} from '../../stage/DroneStage';
// //https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/newtons-laws-of-motion
// //https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/modeling-gravity-and-friction
//
// class Liquid {
//   private x: number;
//   private y: number;
//   private w: number;
//   private h: number;
//   private c: number;
//   private canvas: HTMLCanvasElement;
//   constructor(x: number, y: number, w: number, h: number, c: number, canvas: HTMLCanvasElement) {
//   this.x = x;
//   this.y = y;
//   this.w = w;
//   this.h = h;
//   this.c = c;
//   this.canvas = canvas;
//   }
//
// // Is the Mover in the Liquid?
//   contains(m: LiquidGravityDummy) {
//   const p = m.position;
//   return p.x > this.x && p.x < this.x + this.w &&
//     p.y > this.y && p.y < this.y + this.h;
//   }
//
//   // Calculate drag force
//   calculateDrag(m: LiquidGravityDummy) {
//   // Magnitude is coefficient * speed squared
//   const speed = m.velocity.mag();
//   const dragMagnitude = this.c * speed * speed;
//
//   // Direction is inverse of velocity
//   const dragForce = m.velocity.get();
//   dragForce.mult(-1);
//
//   // Scale according to magnitude
//   dragForce.normalize();
//   dragForce.mult(dragMagnitude);
//   return dragForce;
// }
//
//   display = function() {
//     const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
//     context.setTransform(1, 0, 0, 1, 0, 0);
//     // noStroke();
//     context.fillStyle = 'rgba(0,0,200,0.5)';
//     context.rect(this.x, this.y, this.w, this.h);
//     context.fill();
//   };
//
// }
//
// export class LiquidGravityDummy extends ObjDrone {
//   public position: PointVector;
//   public velocity: PointVector;
//   private acceleration: PointVector;
//   private liquid: Liquid;
//
//
//   constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
//     super(stage, x, y, z, canvas);
//     this.onStart();
//   }
//
//
//
//   onStart() {
//     super.onStart();
//     this.mass = RandomUtil.random(5);
//     this.position = new PointVector(30, RandomUtil.random(this.canvas.height));
//     this.velocity = new PointVector(0, 0);
//     this.acceleration = new PointVector(0, 0);
//     this.liquid = new Liquid(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2, 0.1, this.canvas);
//   }
//
//
//
//   onDraw(): void {
//
//     this.liquid.display();
//
//     const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
//     context.setTransform(1, 0, 0, 1, 0, 0);
//     context.fillStyle = '#0FF0F0';
//     context.strokeStyle = '#000000';
//     context.save();
//     context.beginPath();
//
//     // Is the Mover in the liquid?
//     if (this.liquid.contains(this)) {
//       // Calculate drag force
//       const dragForce = this.liquid.calculateDrag(this);
//       // Apply drag force to Mover
//       this.applyForce(dragForce);
//     }
//
//
//     // Gravity is scaled by mass here!
//     const gravity = new PointVector(0, 0.1 * this.mass);
//     this.applyForce(gravity);
//
//
//
//     //////update
//     // Simulates Motion 101 from the vectors tutorial
//     this.velocity.add(this.acceleration);
//     this.position.add(this.velocity);
//     // Now we make sure to clear acceleration each time
//     this.acceleration.mult(0);
//
//
//
//     //display
//     context.beginPath();
//     context.strokeStyle = '#FFFF00';
//     context.lineWidth = 2;
//     context.arc(this.position.x, this.position.y, this.mass * 16, 0, 2 * Math.PI);
//     context.fill();
//
//
//     //checkEdges
//     if (this.position.x > this.canvas.width) {
//       this.position.x = this.canvas.width;
//       this.velocity.x *= -1;
//     } else if (this.position.x < 0) {
//       this.velocity.x *= -1;
//       this.position.x = 0;
//     }
//     if (this.position.y > this.canvas.height) {
//       this.velocity.y *= -1;
//       this.position.y = this.canvas.height;
//     }
//
//
//
//
//
//
//   }
//
//
//   applyForce(force: PointVector) {
//     const f = PointVector.div(force, this.mass);
//     this.acceleration.add(f);
//   }
//
//
//
//   onStop() {
//     super.onStop();
//     console.log('Mouse onStop');
//   }
//
//   // intentSignal(intent: Intent<GameData>) {
//   // }
//
//
//
// }

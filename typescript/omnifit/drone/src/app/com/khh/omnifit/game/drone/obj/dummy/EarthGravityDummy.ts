import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
import {Rect} from '../../../../../graphics/Rect';
import {PointVector} from '../../../../../math/PointVector';
import {RandomUtil} from '../../../../../math/RandomUtil';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';
//https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/newtons-laws-of-motion
//https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/modeling-gravity-and-friction
//마찰력
export class EarthGravityDummy extends ObjDrone {
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;



  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.onStart();
  }



  onStart() {
    super.onStart();
    this.mass = RandomUtil.random(5);
    this.position = new PointVector(30, RandomUtil.random(this.canvas.height));
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);
  }



  onDraw(): void {

    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "#0FF0F0";
    context.strokeStyle = "#000000";
    context.save();
    context.beginPath();



    //마찰력
    const wind = new PointVector(0.01, 0);
    const gravity = new PointVector(0, 0.1 * this.mass);
    let c = 0.01; //마찰강도
    let normal = 1; //수직힘.
    let frictionMag = c * normal;
    let friction = this.velocity.get();
    friction.mult(-1);
    friction.normalize();
    friction.mult(frictionMag);
    this.applyForce(friction);

    //기본 힘들.
    this.applyForce(wind);
    this.applyForce(gravity);

    // m.update();
    // m.display();
    // m.checkEdges();



    //////update
    // Simulates Motion 101 from the vectors tutorial
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    // Now we make sure to clear acceleration each time
    this.acceleration.mult(0);



    //display
    context.beginPath();
    context.strokeStyle = "#FFFF00";
    context.lineWidth = 2;
    context.arc(this.position.x, this.position.y, this.mass*16, 0, 2 * Math.PI);
    context.fill();


    //checkEdges
    if (this.position.x > this.canvas.width) {
      this.position.x = this.canvas.width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > this.canvas.height) {
      this.velocity.y *= -1;
      this.position.y = this.canvas.height;
    }






  }


  applyForce(force: PointVector) {
    var f = PointVector.div(force, this.mass);
    this.acceleration.add(f);
  };

  clockSignal(value?: any) {
    this.onDraw();
  }


  onStop() {
    super.onStop();
    console.log('Mouse onStop');
  }

  intentSignal(intent: Intent<GameData>) {
  }



}
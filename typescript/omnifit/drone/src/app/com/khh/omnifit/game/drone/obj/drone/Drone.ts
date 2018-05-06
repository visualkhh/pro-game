import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
import {Rect} from '../../../../../graphics/Rect';
import {PointVector} from '../../../../../math/PointVector';
import {RandomUtil} from '../../../../../math/RandomUtil';
export class Drone extends ObjDrone {
  private angle: PointVector;
  private velocity: PointVector;
  private amplitude: PointVector;
  private acceleration: PointVector;
  private gravity: PointVector;

  private beforeIntent: Intent<number>;
  private intent: Intent<number>;

  private  move: number = 0;
  private gvelocity: PointVector;

  constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';

    this.onStart();
  }



  onStart() {
    super.onStart();
    this.angle = new PointVector();
    this.velocity = new PointVector(RandomUtil.random(-0.05, 0.05), RandomUtil.random(-0.05, 0.05));
    this.gvelocity = new PointVector(0,0);
    // this.amplitude = new PointVector(RandomUtil.random(20, this.canvas.width/2), RandomUtil.random(20, this.canvas.height/2));
    // this.amplitude = new PointVector(RandomUtil.random(10,20), RandomUtil.random(10,20));
    this.amplitude = new PointVector(RandomUtil.random(10,20), RandomUtil.random(10,20));
    this.gravity = new PointVector(0, 0.1);
    this.acceleration = new PointVector(0, 0);
    this.mass = 1;
  }

  onDraw(): void {
    let con: number = 0;
    let bcon: number = 0;
    if (this.beforeIntent && this.intent){
      bcon = this.beforeIntent.data;
      con = this.intent.data;
    }

    if(con>0){
      // console.log("oscillate "+con)
      this.oscillate();
    }

    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    //
    // var initX = this.canvas.width/2;
    // var initY = this.canvas.height/2;
    let initX = this.canvas.width / 2;
    let initY = this.canvas.height - this.img.height/2;

    let x = Math.sin(this.angle.x) * this.amplitude.x;
    let y = Math.sin(this.angle.y) * this.amplitude.y;

    let position = new PointVector(x, y);


    // this.applyForce(this.gravity);
    // this.gvelocity.add(this.acceleration);
    // position.add(this.velocity);
    // console.log(position+"  "+this.gravity);



    //width
    // const stepVal = (this.canvas.height - this.img.height) / 10;
    // const conStepVal = (stepVal * con);
    // const bconStepVal = (stepVal * bcon);
    // if((bconStepVal - conStepVal) > 0 ){
    //   console.log("conStepVal>bconStepVal");
    //   position.y = position.y - (--this.move);
    // }else {
    //   position.y = position.y - (++this.move);
    //   console.log("conStepVal>bconStepVal ELSE");
    // }
    const stepVal = (this.canvas.height - this.img.height) / 10;
    const conStepVal = (stepVal * con);
    const bconStepVal = (stepVal * bcon);
    if((con - bcon) > 0  && this.canvas.height < 0){
      console.log("conStepVal>bconStepVal");
      position.y = position.y - (--this.move);
    }else if ((con - bcon) <= 0 && this.canvas.height >= 0) {
      position.y = position.y - (++this.move);
      console.log("conStepVal>bconStepVal ELSE");
    }


    //move
    // var mouse = new PointVector(x, y+=conStepVal);
    // var dir = PointVector.sub(mouse, position);
    // dir.normalize();
    // dir.mult(0.2);
    // this.acceleration = dir;
    // this.velocity.add(this.acceleration);
    // this.velocity.limit(5);
    // position.add(this.velocity);



    context.beginPath();
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.strokeStyle = "#FFFF00";
    context.fillStyle="#FF0000";
    context.lineWidth = 2;
    context.translate(initX, initY);
    context.moveTo(0, 0);
    context.lineTo(position.x, position.y);
    context.stroke();
    context.beginPath();
    context.drawImage(this.img, position.x - this.img.width/2, position.y - this.img.height/2);
    context.arc(position.x, position.y, 1, 0, 2 * Math.PI);
    context.strokeRect(position.x - this.img.width/2, position.y - this.img.height/2, this.img.width, this.img.height);
    context.fill();


    // context.beginPath();
    // context.fillStyle="#FF00FF";
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // context.arc(initX, initY, 10, 0, 2 * Math.PI);
    // context.fill();

  }

  oscillate() {
    this.angle.add(this.velocity);
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

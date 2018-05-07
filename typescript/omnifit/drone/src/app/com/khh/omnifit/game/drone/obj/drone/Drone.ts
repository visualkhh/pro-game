import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
import {Rect} from '../../../../../graphics/Rect';
import {PointVector} from '../../../../../math/PointVector';
import {RandomUtil} from '../../../../../math/RandomUtil';
import {DroneStageEnd} from '../../stage/DroneStageEnd';
import {Clock} from '../../../../../clock/Clock';
import {DroneStageIntro} from '../../stage/DroneStageIntro';
import {DroneStageManager} from '../../stage/DroneStageManager';
import {DroneStageGame} from '../../stage/DroneStageGame';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';
import {isNullOrUndefined} from 'util';
export class Drone extends ObjDrone {
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private mousemoveEvent: MouseEvent;
  private beforeIntent: Intent<GameData>;
  private intent: Intent<GameData>;

  private beforePoint: PointVector;
//
  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.onStart();
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';
  }

  onStart() {
    super.onStart();
    this.position = new PointVector(this.canvas.width/2, this.canvas.height/2);
    // this.position = new PointVector(RandomUtil.random(this.canvas.width), RandomUtil.random(this.canvas.height));
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);
  }

  mousemove(event: MouseEvent): void {
    super.mousemove(event);
    this.mousemoveEvent = event;
  }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    let mouseX = this.mousemoveEvent?this.mousemoveEvent.offsetX:1;
    let mouseY = this.mousemoveEvent?this.mousemoveEvent.offsetY:1;
    let con: number = 0;
    let bcon: number = 0;
    let wind: PointVector = new PointVector();
    let bwind: PointVector = new PointVector()
    if (this.beforeIntent && this.intent){
      bcon = this.beforeIntent.data.con;
      con = this.intent.data.con;
      bwind = this.beforeIntent.data.wind;
      wind = this.intent.data.wind;
    }
    // if(con>0){
    //   this.velocity.limit(3);
    // }else{
    //   this.velocity.limit(0);
    // }

    //height
    const stepVal = (this.canvas.height - this.img.height) / 10;
    const conStepVal = (stepVal * con);
    const bconStepVal = (stepVal * bcon);
    // var mouse = new PointVector((this.canvas.width/2)+RandomUtil.random((this.img.width/2)*-1,this.img.width/2), (this.canvas.height - this.img.height/2) - conStepVal);
    var mouse = new PointVector((this.canvas.width/2), (this.canvas.height - this.img.height/2) - conStepVal);
    mouse.add(wind);

    // console.log("MouseDummy ("+this.mousemoveEvent+")"+mouseX+","+mouseY);
    //////update
    // var mouse = new PointVector(mouseX, mouseY);
    var dir = PointVector.sub(mouse, this.position);
    dir.normalize();
    dir.mult(0.2);
    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(2);
    this.position.add(this.velocity);


    //checkEdges
    if (this.position.x > this.canvas.width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = this.canvas.width;
    }

    if (this.position.y > this.canvas.height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = this.canvas.height;
    }
    //display
    //http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 2;
    // context.drawImage(this.img, this.position.x - this.img.width/2, this.position.y - this.img.height/2, this.img.width * 0.3, this.img.height * 0.3);

    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.arc(this.position.x, this.canvas.height, 20, 0, 2 * Math.PI);
    context.fill();
    context.restore();
    context.translate(this.position.x, this.position.y);
    if(!isNullOrUndefined(this.beforePoint) && this.beforePoint.x-this.position.x>0){
      // let p = PointVector.sub(this.beforePoint,this.position)
      // context.rotate(-p.mag());
      // let p = PointVector.sub(this.beforePoint,this.position)
      // p.normalize()
      context.rotate(-0.06);
    }else if(!isNullOrUndefined(this.beforePoint) && this.beforePoint.x-this.position.x<0){
      // p.normalize()
      // context.rotate(p.mag());
      context.rotate(0.06);
    }

    context.scale(0.5, 0.5);
    context.drawImage(this.img, -this.img.width/2, -this.img.height/2);
    context.arc(0, 0, 5, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();




    this.beforePoint = this.position.get();

    // let grad = context.createRadialGradient(150, 75, 0, 150, 75, 50);
    // // grad.addColorStop(0,'rgba(0, 0, 0, 0.5)');
    // // grad.addColorStop(1,'rgba(0, 0, 0, 0)');
    // grad.addColorStop(0,'rgba(0, 0, 0, 1)');
    // grad.addColorStop(1,'rgba(0, 0, 0, 0.5)');
    // context.fillStyle = grad;
    // context.setTransform(1, 0, 0, 1, 0, 0);

    // context.fill();
    // context.restore();
  }

  clockSignal(value?: any) {
    this.onDraw();
  }

  onStop() {
    super.onStop();
    console.log('Mouse onStop');
  }

  intentSignal(intent: Intent<GameData>) {
    if (!this.beforeIntent){
      this.beforeIntent = intent;
      this.intent = intent;
    }else{
      this.beforeIntent = this.intent;
      this.intent = intent;
    }
  }
}

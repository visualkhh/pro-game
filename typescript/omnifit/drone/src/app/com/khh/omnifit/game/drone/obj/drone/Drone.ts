import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../../../../../lib-typescript/com/khh/data/Intent';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';
import {isNullOrUndefined} from 'util';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/math/RandomUtil';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {DeviceManager} from '../../../../drive/DeviceManager';

export class Drone extends ObjDrone {
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private beforePoint: PointVector;

  private beforeHeadsetConcentration: number = 0;
  private headsetConcentration: number = 0;
  private beforeWind: number = 0;
  private wind: number = 0;


  private windSubscription: Subscription;
  private concentrationSubscription: Subscription;
  private resizeSubscription: Subscription;
  private clockSubscription: Subscription;


  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.onStart();
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';
  }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);

    //height
    const stepVal = (this.canvas.height - this.img.height) / 10;
    const conStepVal = (stepVal * this.headsetConcentration);

    // var mouse = new PointVector((this.canvas.width/2)+RandomUtil.random((this.img.width/2)*-1,this.img.width/2), (this.canvas.height - this.img.height/2) - conStepVal);
    var targetPosition = new PointVector((this.canvas.width/2), (this.canvas.height - this.img.height/2) - conStepVal);
    targetPosition.add(this.wind);

    // console.log("MouseDummy ("+this.mousemoveEvent+")"+mouseX+","+mouseY);
    //////update
    var dir = PointVector.sub(targetPosition, this.position);
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
      context.rotate(-0.06);
    }else if(!isNullOrUndefined(this.beforePoint) && this.beforePoint.x-this.position.x<0){
      context.rotate(0.06);
    }

    context.scale(0.5, 0.5);
    context.drawImage(this.img, -this.img.width/2, -this.img.height/2);
    context.arc(0, 0, 5, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    this.beforePoint = this.position.get();
  }


  onStart() {
    super.onStart();
    // this.position = new PointVector(this.canvas.width/2, this.canvas.height/2);
    this.position = new PointVector(RandomUtil.random(this.canvas.width), RandomUtil.random(this.canvas.height));
    this.velocity = new PointVector(0, 0);
    this.acceleration = new PointVector(0, 0);
    this.resizeSubscription = Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event) => {
      this.onDraw();
    });

    //집중도
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe(concentration => {
      this.beforeHeadsetConcentration = this.headsetConcentration;
      this.headsetConcentration = concentration;
    });
    this.windSubscription = this.stage.subscribe('windObservable', wind => {
      this.beforeWind = this.wind;
      this.wind = wind;
    });
    this.clockSubscription = this.stage.clockSubscribe((date:Date)=>{
      console.log("clock  "+date);
    })

  }

  onStop() {
    super.onStop();
    if(!isNullOrUndefined(this.resizeSubscription)){this.resizeSubscription.unsubscribe();}
    if(!isNullOrUndefined(this.concentrationSubscription)){this.concentrationSubscription.unsubscribe();}
    if(!isNullOrUndefined(this.windSubscription)){this.windSubscription.unsubscribe();}
    if(!isNullOrUndefined(this.clockSubscription)){this.clockSubscription.unsubscribe();}
  }

}

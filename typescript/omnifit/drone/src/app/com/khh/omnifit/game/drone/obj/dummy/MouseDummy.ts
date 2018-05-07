import { Observable } from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {Point} from '../../../../../graphics/Point';
import {Rect} from '../../../../../graphics/Rect';
import {PointVector} from '../../../../../math/PointVector';
import {RandomUtil} from '../../../../../math/RandomUtil';
import {GameData} from '../../vo/GameData';
export class MouseDummy extends ObjDrone {
  private position: PointVector;
  private velocity: PointVector;
  private acceleration: PointVector;
  private mousemoveEvent: MouseEvent;



  constructor(x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(x, y, z, canvas);
    this.onStart();
  }



  onStart() {
    super.onStart();
    // this.position = new PointVector(this.canvas.width/2, this.canvas.height/2);
    this.position = new PointVector(RandomUtil.random(this.canvas.width), RandomUtil.random(this.canvas.height));
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


    // console.log("MouseDummy ("+this.mousemoveEvent+")"+mouseX+","+mouseY);
    //////update
    var mouse = new PointVector(mouseX, mouseY);
    var dir = PointVector.sub(mouse, this.position);
    dir.normalize();
    dir.mult(0.2);
    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(5);
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
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 2;
    context.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
    context.fill();




  }




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

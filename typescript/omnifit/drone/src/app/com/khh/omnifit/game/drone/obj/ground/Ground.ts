import { Observable } from 'rxjs/Observable';
import { Point } from '../../../../../graphics/Point';
import { Obj } from '../../../../../obj/Obj';
import {ObjImg} from '../../../../../graphics/ObjImg';
import {Rect} from '../../../../../graphics/Rect';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {GameData} from '../../vo/GameData';
import {DroneStage} from '../../stage/DroneStage';
import {PointVector} from '../../../../../math/PointVector';
// import { Point } from '../org/Point';
export class Ground extends ObjDrone{


  private maxX: number = 50;
  private currentX: number = 0;
  private beforeWind: number = 0;
  private wind: number = 0;
  constructor(stage: DroneStage,x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = "assets/image/ground.png";
  }

  onDraw(): void {



    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    let context: CanvasRenderingContext2D = this.canvas.getContext("2d");
    if(this.beforeWind - this.wind>0){
      this.currentX -= 0.5;
    }else if(this.beforeWind - this.wind<0){
      this.currentX += 0.5;
    }
    context.drawImage(this.img, (x - this.img.width/2) + this.currentX, this.canvas.height -  this.img.height);
  }

  clockSignal(value?: any) {
    this.onDraw();
  }
  intentSignal(intent: Intent<GameData>) {
    if(this.beforeWind!=intent.data.wind.x){
      this.beforeWind=intent.data.wind.x
    }else{
      this.wind=intent.data.wind.x
    }
  }

}

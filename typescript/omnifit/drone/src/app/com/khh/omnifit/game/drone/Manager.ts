import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Rect } from 'app/com/khh/graphics/Rect';
import { Drone } from 'app/com/khh/omnifit/game/drone/obj/drone/Drone';
import { Ground } from 'app/com/khh/omnifit/game/drone/obj/ground/Ground';
import { Cloud } from 'app/com/khh/omnifit/game/drone/obj/cloud/Cloud';
import {Obj} from '../../../obj/Obj';
import {Stage} from '../../../stage/Stage';
import {DroneStageIntro} from './stage/DroneStageIntro';
import {Clock} from '../../../clock/Clock';
// import { Point } from '../org/Point';
export class Manager {
  private static instance: Manager;


  private clock: Clock;
  private stage: Stage;
  private _canvas: HTMLCanvasElement;


  public constructor(canvas: HTMLCanvasElement) {
    this.init(canvas);
  }

  // static getInstance() {
  //   if (!Manager.instance) {
  //     Manager.instance = new Manager();
  //   }
  //   return Manager.instance;
  // }


  private init(canvas: HTMLCanvasElement) {
    this.clock = new Clock(1000);
    this._canvas = canvas;
    this.stage = new DroneStageIntro(null, this.clock, canvas);
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  draw(): void{


    console.log("manager --> Draw");
    this.clock.signalForce();
    // console.log(this.stage.next());
    // this.clock.subscribe((x)=>console.log("x-- "+x))
    // this.clock.subscribe((b)=>console.log("b-- "+b))
    // this.clock.subscribe((c)=>console.log("c-- "+c))
    // // setTimeout(()=>this.clock.unsubscribe(),5000)
    // setTimeout(()=>this.clock.iterval=5000,5000)
    //set
    // this.drones.set();
    // this.grounds.set();
    // this.clouds.set();

    ///////////draw
    // this.drones.onDraw(canvas);
    // this.grounds.onDraw(canvas);
    // this.clouds.onDraw(canvas);
  }
}

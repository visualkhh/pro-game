import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Rect } from 'app/com/khh/graphics/Rect';
import { Drone } from 'app/com/khh/domain/obj/drone/Drone';
import { Ground } from 'app/com/khh/domain/obj/ground/Ground';
import { Cloud } from 'app/com/khh/domain/obj/cloud/Cloud';
// import { Point } from '../org/Point';
export class Manager {
  private static instance: Manager;


  private drones: Drone;
  private grounds: Ground;
  private clouds: Cloud;

  private constructor() {
    this.init();
  }

  private init() {
    this.drones = new Drone();
    this.grounds = new Ground();
    this.clouds = new Cloud();
  }


  static getInstance() {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  draw(canvas: HTMLCanvasElement): void{
    console.log("manager -->"+canvas)


    //set
    this.drones.set();
    this.grounds.set();
    this.clouds.set();

    ///////////draw
    this.drones.onDraw(canvas);
    this.grounds.onDraw(canvas);
    this.clouds.onDraw(canvas);
  }
}

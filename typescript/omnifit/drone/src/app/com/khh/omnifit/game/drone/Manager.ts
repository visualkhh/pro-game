import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Rect } from 'app/com/khh/graphics/Rect';
import { Drone } from 'app/com/khh/omnifit/game/drone/obj/drone/Drone';
import { Ground } from 'app/com/khh/omnifit/game/drone/obj/ground/Ground';
import { Cloud } from 'app/com/khh/omnifit/game/drone/obj/cloud/Cloud';
import {Obj} from '../../../obj/Obj';
import {Stage} from './stage/Stage';
import {StageIntro} from './stage/StageIntro';
// import { Point } from '../org/Point';
export class Manager {
  private static instance: Manager;



  private stage: Stage;


  private constructor() {
    this.init();
  }

  private init() {
    this.stage = new StageIntro();
  }


  static getInstance() {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  draw(canvas: HTMLCanvasElement): void{
    console.log("manager -->"+canvas)



    console.log(this.stage.next());

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

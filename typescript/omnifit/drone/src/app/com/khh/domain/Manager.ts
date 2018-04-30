import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Rect } from 'app/com/khh/graphics/Rect';
// import { Point } from '../org/Point';
export class Manager {
  private static instance: Manager;


  private constructor() {
  }
  static getInstance() {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  draw(canvas: HTMLCanvasElement): void{
    console.log("manager -->"+canvas)
  }
}

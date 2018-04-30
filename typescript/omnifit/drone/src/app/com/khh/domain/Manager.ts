import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Rect } from 'app/com/khh/graphics/Rect';
// import { Point } from '../org/Point';
export class Manager {
  private static instance: Manager;
  private constructor() {
    // do something construct...
  }
  static getInstance() {
    if (!Manager.instance) {
      Manager.instance = new Manager();
      // ... any one time initialization goes here ...
    }
    return Manager.instance;
  }

  /*
    let something = new Singleton() // Error: constructor of 'Singleton' is private.
    let instance = Singleton.getInstance() // do something with the instance...
   */
  someMethod() { }
}

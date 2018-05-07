import { Observable } from 'rxjs/Observable';
import {IntentSignal} from '../../../../data/IntentSignal';
import {Intent} from '../../../../data/Intent';
import {ObjImg} from '../../../../graphics/ObjImg';
import {GameData} from '../vo/GameData';
// import { Point } from '../org/Point';
// import * as abc from 'assert/js/processing-1.4.1.js';
export abstract class ObjDrone extends ObjImg implements LifeCycle, IntentSignal<GameData>, MouseSignal, KeyboardSignal{

  abstract intentSignal(intent: Intent<GameData>);


  onCreate() {
  }

  onStart() {
    // const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // context.fillStyle = "#000000";
    // context.strokeStyle = "#000000";
    // context.save();
  }

  onResume() {
  }

  onRestart() {
    this.onStart();
  }

  onPause() {
  }

  onStop() {
  }

  onDestroy() {
  }

  // checkEdges = function() {
  //   if (this.position.x > width) {
  //     this.position.x = 0;
  //   }
  //   else if (this.position.x < 0) {
  //     this.position.x = width;
  //   }
  //
  //   if (this.position.y > height) {
  //     this.position.y = 0;
  //   }
  //   else if (this.position.y < 0) {
  //     this.position.y = height;
  //   }
  // };


  keydown(event: KeyboardEvent): void {
  }

  keyup(event: KeyboardEvent): void {
  }

  mousedown(event: MouseEvent): void {
  }

  mousemove(event: MouseEvent): void {
  }

  mouseup(event: MouseEvent): void {
  }


}

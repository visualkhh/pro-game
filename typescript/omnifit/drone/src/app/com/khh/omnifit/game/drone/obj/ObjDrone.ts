import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import {ObjImg} from 'app/com/khh/graphics/ObjImg';
import {Rect} from 'app/com/khh/graphics/Rect';
import {IntentSignal} from '../../../../data/IntentSignal';
import {Intent} from '../../../../data/Intent';
// import { Point } from '../org/Point';
// import * as abc from 'assert/js/processing.js';
export abstract class ObjDrone extends ObjImg implements LifeCycle, IntentSignal<number>{
  abstract intentSignal(intent: Intent<number>);


  onCreate() {
  }

  onStart() {
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





}

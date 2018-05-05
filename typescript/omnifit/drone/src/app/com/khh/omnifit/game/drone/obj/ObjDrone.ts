import { Observable } from 'rxjs/Observable';
import {IntentSignal} from '../../../../data/IntentSignal';
import {Intent} from '../../../../data/Intent';
import {ObjImg} from '../../../../graphics/ObjImg';
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

import {IntentSignal} from '../../../../../../../../lib-typescript/com/khh/data/IntentSignal';
import {Intent} from '../../../../../../../../lib-typescript/com/khh/data/Intent';
import {ObjImg} from '../../../../../../../../lib-typescript/com/khh/graphics/ObjImg';
import {GameData} from '../vo/GameData';
import {Point} from '../../../../../../../../lib-typescript/com/khh/graphics/Point';
import {DroneStage} from '../stage/DroneStage';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {MouseSignal} from '../../../../../../../../lib-typescript/com/khh/event/io/mouse/MouseSignal';
import {KeyboardSignal} from '../../../../../../../../lib-typescript/com/khh/event/io/keyboard/KeyboardSignal';

export abstract class ObjDrone extends ObjImg implements LifeCycle, IntentSignal<GameData>, MouseSignal, KeyboardSignal{

  abstract intentSignal(intent: Intent<GameData>);

  private _stage: DroneStage;

  get stage(): DroneStage {
    return this._stage;
  }

  constructor(stage: DroneStage, x: number = 0, y: number = 0, z: number = 0, canvas: HTMLCanvasElement, img?: HTMLImageElement, head?: Point) {
    super(x, y, z, canvas, img, head);
    this._stage = stage;
  }

  onCreate(data?: any) {
  }

  onStart(data?: any) {
  }

  onResume(data?: any) {
  }

  onRestart(data?: any) {
    this.onStart(data);
  }

  onPause(data?: any) {
  }

  onStop(data?: any) {
  }

  onDestroy(data?: any) {
  }


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

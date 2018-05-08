import {IntentSignal} from '../../../../data/IntentSignal';
import {Intent} from '../../../../data/Intent';
import {ObjImg} from '../../../../graphics/ObjImg';
import {GameData} from '../vo/GameData';
import {Point} from '../../../../graphics/Point';
import {DroneStage} from '../stage/DroneStage';

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

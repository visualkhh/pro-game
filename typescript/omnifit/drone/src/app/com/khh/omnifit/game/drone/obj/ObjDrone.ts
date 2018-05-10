import {ObjImg} from '../../../../../../../../lib-typescript/com/khh/graphics/ObjImg';
import {Point} from '../../../../../../../../lib-typescript/com/khh/graphics/Point';
import {DroneStage} from '../stage/DroneStage';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';

export abstract class ObjDrone extends ObjImg implements LifeCycle{

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
  }

  onPause(data?: any) {
  }

  onStop(data?: any) {
  }

  onDestroy(data?: any) {
  }
}

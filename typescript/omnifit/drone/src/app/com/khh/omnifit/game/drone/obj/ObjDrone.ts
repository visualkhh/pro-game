import {ObjImg} from '../../../../../../../../lib-typescript/com/khh/graphics/ObjImg';
import {Point} from '../../../../../../../../lib-typescript/com/khh/graphics/Point';
import {DroneStage} from '../stage/DroneStage';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {ViewInterface} from '../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';

export abstract class ObjDrone extends ObjImg implements LifeCycle, ViewInterface {
  private _stage: DroneStage;

  get stage(): DroneStage {
    return this._stage;
  }

  constructor(stage: DroneStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement, head?: Point) {
    super(x, y, z, img, head);
    this._stage = stage;
  }

  abstract onCreate(data?: any);
  abstract onDestroy(data?: any);
  abstract onPause(data?: any);
  abstract onRestart(data?: any);
  abstract onResume(data?: any);
  abstract onStart(data?: any);
  abstract onStop(data?: any);
  abstract onDraw(CanvasRenderingContext2D): void;
}

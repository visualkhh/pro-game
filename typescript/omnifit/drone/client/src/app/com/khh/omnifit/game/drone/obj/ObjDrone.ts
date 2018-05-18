import {LifeCycle} from '../../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {ResizeSignal} from '../../../../../../../../../lib-typescript/com/khh/event/window/ResizeSignal';
import {ObjImg} from '../../../../../../../../../lib-typescript/com/khh/graphics/ObjImg';
import {Point} from '../../../../../../../../../lib-typescript/com/khh/graphics/Point';
import {ViewInterface} from '../../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';
import {DroneStage} from '../stage/DroneStage';

export abstract class ObjDrone extends ObjImg implements LifeCycle, ViewInterface {
  // private _stage: DroneStage | ((_?) => DroneStage);
  private _stage: DroneStage;
  private _id: string;

  constructor(stage: DroneStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement, head?: Point) {
    super(x, y, z, img, head);
    this._stage = stage;
  }

  get stage(): DroneStage {
    // if (typeof this._stage === 'function') {
    //   return this._stage();
    // }
    return this._stage;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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

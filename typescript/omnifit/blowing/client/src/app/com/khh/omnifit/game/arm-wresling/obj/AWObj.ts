import {LifeCycle} from '../../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {ObjImg} from '../../../../../../../../../lib-typescript/com/khh/graphics/ObjImg';
import {Point} from '../../../../../../../../../lib-typescript/com/khh/graphics/Point';
import {ViewInterface} from '../../../../../../../../../lib-typescript/com/khh/graphics/view/ViewInterface';
import {AWStage} from '../stage/AWStage';

export abstract class AWObj extends ObjImg implements LifeCycle, ViewInterface {
  // private _stage: DroneStage | ((_?) => DroneStage);
  private _stage: AWStage;
  private _id: string;

  constructor(stage: AWStage, x: number = 0, y: number = 0, z: number = 0, img?: HTMLImageElement, head?: Point) {
    super(x, y, z, img, head);
    this._stage = stage;
  }

  get stage(): AWStage {
    // if (typeof this._stage === 'function') {
    //   return this._stage();
    // }
    return this._stage;
  }

  set stage(value: AWStage) {
    this._stage = value;
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

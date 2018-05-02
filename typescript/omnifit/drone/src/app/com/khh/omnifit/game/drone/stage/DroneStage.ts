import {ClockStage} from '../../../../stage/ClockStage';
import {Stage} from '../../../../stage/Stage';
import {Clock} from '../../../../clock/Clock';

export abstract class DroneStage extends ClockStage{


  private _canvas: HTMLCanvasElement;

  constructor(refer: Stage, clock: Clock, canvas: HTMLCanvasElement) {
    super(clock);
    this._canvas = canvas;
  }


  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }


  abstract onDraw(): void;
}

import {ClockSignal} from '../clock/ClockSignal';
import {Point} from '../graphics/Point';

export abstract class Obj extends Point{

  //질량
  private _mass: number;

  get mass(): number {
    return this._mass;
  }

  set mass(value: number) {
    this._mass = value;
  }


}

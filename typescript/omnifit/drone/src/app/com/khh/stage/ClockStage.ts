import {Stage} from './Stage';
import {Clock} from '../clock/Clock';
import {ClockSignal} from '../clock/ClockSignal';

export abstract class ClockStage extends Stage implements ClockSignal {


  private _clock: Clock;
  constructor(clock: Clock) {
    super();
    this._clock = clock;
  }


  get clock(): Clock {
    return this._clock;
  }

  set clock(value: Clock) {
    this._clock = value;
  }

  abstract clockSignal(value: number);

}

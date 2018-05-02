import {Stage} from './Stage';
import {Clock} from '../clock/Clock';

export abstract class ClockStage extends Stage{


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

  public abstract clockSignal(value: number);

}

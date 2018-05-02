import {Stage} from './Stage';
import {Stage1} from './Stage1';

export class StageIntro extends Stage{
  next(): Stage;
  next(name: string): Stage;
  next(name?: string): Stage {
    return new Stage1();
  }

  previous(): Stage;
  previous(name: string): Stage;
  previous(name?: string): Stage {
    return this;
  }

}

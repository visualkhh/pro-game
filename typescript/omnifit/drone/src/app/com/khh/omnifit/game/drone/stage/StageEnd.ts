import {Stage} from './Stage';
import {Stage1} from './Stage1';
import {StageIntro} from './StageIntro';

export class StageEnd extends Stage{
  next(): Stage;
  next(name: string): Stage;
  next(name?: string): Stage {
    return new StageIntro();
  }

  previous(): Stage;
  previous(name: string): Stage;
  previous(name?: string): Stage {
    return new Stage1();
  }

}

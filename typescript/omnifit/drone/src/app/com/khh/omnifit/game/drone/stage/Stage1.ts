import {Stage} from './Stage';

export class Stage1 extends Stage{
  next(): Stage;
  next(name: string): Stage;
  next(name?: string): Stage {
    return undefined;
  }

  previous(): Stage;
  previous(name: string): Stage;
  previous(name?: string): Stage {
    return undefined;
  }

}

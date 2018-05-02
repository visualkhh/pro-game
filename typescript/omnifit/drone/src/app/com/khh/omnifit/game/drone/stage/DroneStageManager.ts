import {Stage} from '../../../../stage/Stage';
import {DroneStageGame} from './DroneStageGame';
import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';

export class DroneStageManager {



  public next(): Stage;
  public next(name?: string): Stage{
    return null;
  }
  public previous(): Stage;
  public previous(name?: string): Stage{
    return null;

  }
}

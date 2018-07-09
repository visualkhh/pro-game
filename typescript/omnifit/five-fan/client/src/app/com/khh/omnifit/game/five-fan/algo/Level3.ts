import {Subscription} from 'rxjs/Subscription';
import {Algo} from '../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Algo';
import {LifeCycle} from '../../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {DeviceManager} from '../../../drive/DeviceManager';
import {AWObj} from '../obj/AWObj';

export class Level3 extends Algo {

  private concentrationSubscription: Subscription;

  constructor(uuid?: string, host?: string, name?: string) {
    super(uuid, host);
    this.name = name;
  }

  onCreate(data?: any): Algo {
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
      this.headsetConcentration = concentration;
      this.headsetConcentrationHistory.push(concentration);
      if (concentration >=8 ){
        this.successHistory.push(concentration);
      }
    });
    return this;
  }

  onPause(data?: any): Algo {
    return this;
  }

  onRestart(data?: any): Algo {
    return this;
  }

  onResume(data?: any): Algo {
    return this;
  }

  onStart(data?: any): Algo {
    return this;
  }

  onStop(data?: any): Algo {
    return this;
  }
  onDestroy(data?: any): Algo {
    this.concentrationSubscription.unsubscribe();
    return this;
  }
}

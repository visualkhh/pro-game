import {Subscription} from 'rxjs/Subscription';
import {LifeCycle} from '../../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {DeviceManager} from '../../../drive/DeviceManager';
import {ObjAW} from '../obj/ObjAW';
import {Algo} from '../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Algo';

export class Level1 extends Algo {

  private concentrationSubscription: Subscription;

  constructor(uuid?: string, host?: string) {
    super(uuid, host);
  }

  onCreate(data?: any) {
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
      if (RandomUtil.random(0, 100) <= 20) {
        concentration = Math.min(10, RandomUtil.random(concentration, 10) + 1);
      } else {
        concentration = Math.max(0, RandomUtil.random(0, concentration));
      }
      this.headsetConcentration = concentration;
      this.headsetConcentrationHistory.push(concentration);
    });
  }

  onPause(data?: any) {
  }

  onRestart(data?: any) {
  }

  onResume(data?: any) {
  }

  onStart(data?: any) {
  }

  onStop(data?: any) {
  }
  onDestroy(data?: any) {
    this.concentrationSubscription.unsubscribe();
  }

}

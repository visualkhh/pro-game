import {Subscription} from 'rxjs/Subscription';
import {DeviceManager} from '../../../drive/DeviceManager';
import {Algo} from '../../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Algo';

export class Local extends Algo {
  private concentrationSubscription: Subscription;

  constructor(uuid?: string, host?: string) {
    super(uuid, host);
  }

  onCreate(data?: any) {
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
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

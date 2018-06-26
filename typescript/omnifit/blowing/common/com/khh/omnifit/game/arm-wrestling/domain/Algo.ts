import {LifeCycle} from '../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';

export abstract class Algo implements LifeCycle {
  public uuid: string;
  public name: string;
  public host: string;
  public headsetConcentration = 0;
  public headsetConcentrationHistory = new Array<number>();
  constructor(uuid = 'local', host = 'local') {
    this.uuid = uuid;
    this.host = host;
  }
  public clearConcentration() {
    this.headsetConcentration = 0;
    this.headsetConcentrationHistory.length = 0;
    this.headsetConcentrationHistory = new Array<number>();
  }
  abstract onCreate(...data: any[]);

  abstract onDestroy(data?: any);

  abstract onPause(data?: any);

  abstract onRestart(data?: any);

  abstract onResume(data?: any);

  abstract onStart(data?: any);

  abstract onStop(data?: any);


}

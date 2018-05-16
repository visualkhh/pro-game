import {Subject} from 'rxjs/Subject';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {DroneStage} from './stage/DroneStage';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {Observable} from 'rxjs/Observable';

export class DroneResourceManager implements LifeCycle {
  private static instance: DroneResourceManager;

  private _resources: Map<string, HTMLImageElement>;

//singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance() {
    if (!DroneResourceManager.instance) {
      DroneResourceManager.instance = new DroneResourceManager();
    }
    return DroneResourceManager.instance;
  }

  private constructor() {
    const cloudImg = new Image(); cloudImg.src = 'assets/image/cloud.png';
    const groundImg = new Image(); groundImg.src = 'assets/image/ground.png';
    const readyGreenImg = new Image(); readyGreenImg.src = 'assets/image/button/green-chrome.png';
    const readyBlueImg = new Image(); readyBlueImg.src = 'assets/image/button/blue-chrome.png';
    const readyYellowImg = new Image(); readyYellowImg.src = 'assets/image/button/yellow-chrome.png';
    const droneImg = new Image(); droneImg.src = 'assets/image/drone.png';

    this._resources = new Map<string, HTMLImageElement>();
    this._resources.set('cloudImg', cloudImg);
    this._resources.set('groundImg', groundImg);
    this._resources.set('readyGreenImg', readyGreenImg);
    this._resources.set('readyBlueImg', readyBlueImg);
    this._resources.set('readyYellowImg', readyYellowImg);
    this._resources.set('droneImg', droneImg);

    this._resources.forEach((v, k) => {
      Observable.fromEvent(v, 'load').subscribe( (it) => {
        console.log(it);
      });
    });
  }

  get resources(): Map<string, HTMLImageElement> {
    return this._resources;
  }

  onCreate(...data: any[]) {
  }

  onDestroy(data?: any) {
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
}

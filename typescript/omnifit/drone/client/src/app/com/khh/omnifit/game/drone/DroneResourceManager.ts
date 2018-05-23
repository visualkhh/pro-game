import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {LifeCycle} from '../../../../../../../../lib-typescript/com/khh/event/life/LifeCycle';
import {DroneStage} from './stage/DroneStage';

export class DroneResourceManager implements LifeCycle {
  private static instance: DroneResourceManager;

  private _resources: Map<string, any>;

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
    const hostDroneImg = new Image(); hostDroneImg.src = 'assets/image/host-drone.png';
    const character_01Img = new Image(); character_01Img.src = 'assets/image/character_01.png';
    const character_02Img = new Image(); character_02Img.src = 'assets/image/character_02.png';
    const character_03Img = new Image(); character_03Img.src = 'assets/image/character_03.png';
    const effect_character02Img = new Image(); effect_character02Img.src = 'assets/image/effect_character02.png';
    const effect_character03Img = new Image(); effect_character03Img.src = 'assets/image/effect_character03.png';

    this._resources = new Map<string, HTMLImageElement>();
    this._resources.set('cloudImg', cloudImg);
    this._resources.set('groundImg', groundImg);
    this._resources.set('readyGreenImg', readyGreenImg);
    this._resources.set('readyBlueImg', readyBlueImg);
    this._resources.set('readyYellowImg', readyYellowImg);
    this._resources.set('droneImg', droneImg);
    this._resources.set('hostDroneImg', hostDroneImg);
    this._resources.set('character_01Img', character_01Img);
    this._resources.set('character_02Img', character_02Img);
    this._resources.set('character_03Img', character_03Img);
    this._resources.set('effect_character02Img', effect_character02Img);
    this._resources.set('effect_character03Img', effect_character03Img);

    // this._resources.forEach((v, k) => {
    //   Observable.fromEvent(v, 'load').subscribe( (it: Event) => {
    //     //it.srcElement;
    //     console.log(it);
    //   });
    // });
  }

  resources(name: string): any {
    return this._resources.get(name);
  }

  setImageResources(name: string, src: string, load: (it: Event) => void): HTMLImageElement {
    const img = new Image(); img.src = src;
    Observable.fromEvent(img, 'load').subscribe(load);
    this._resources.set(name, img);
    return img;
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

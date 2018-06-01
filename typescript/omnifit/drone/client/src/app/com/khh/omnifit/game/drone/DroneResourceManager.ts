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
    const character_03_1Img = new Image(); character_03_1Img.src = 'assets/image/character_03_1.png';
    const character_04Img = new Image(); character_04Img.src = 'assets/image/character_04.png';
    const character_2_01Img = new Image(); character_2_01Img.src = 'assets/image/character_2_01.png';
    const character_2_02Img = new Image(); character_2_02Img.src = 'assets/image/character_2_02.png';
    const character_2_03_1Img = new Image(); character_2_03_1Img.src = 'assets/image/character_2_03_1.png';
    const character_2_03_2Img = new Image(); character_2_03_2Img.src = 'assets/image/character_2_03_2.png';
    const character_2_04Img = new Image(); character_2_04Img.src = 'assets/image/character_2_04.png';
    const character_3_01Img = new Image(); character_3_01Img.src = 'assets/image/character_3_01.png';
    const character_3_02Img = new Image(); character_3_02Img.src = 'assets/image/character_3_02.png';
    const character_3_03_1Img = new Image(); character_3_03_1Img.src = 'assets/image/character_3_03_1.png';
    const character_3_03_2Img = new Image(); character_3_03_2Img.src = 'assets/image/character_3_03_2.png';
    const character_3_04Img = new Image(); character_3_04Img.src = 'assets/image/character_3_04.png';
    const effect_character02Img = new Image(); effect_character02Img.src = 'assets/image/effect_character02.png';
    const effect_character03Img = new Image(); effect_character03Img.src = 'assets/image/effect_character03.png';
    const effect_character04_3Img = new Image(); effect_character04_3Img.src = 'assets/image/effect_character04_3.png';
    const effect_character04_4Img = new Image(); effect_character04_4Img.src = 'assets/image/effect_character04_4.png';
    const ic_wifi_connectImg = new Image(); ic_wifi_connectImg.src = 'assets/image/ic_wifi_connect.png';
    const character_right_bgImg = new Image(); character_right_bgImg.src = 'assets/image/character_right_bg.png';
    const gage_00Img = new Image(); gage_00Img.src = 'assets/image/gage_00.png';
    const gage_01Img = new Image(); gage_01Img.src = 'assets/image/gage_01.png';
    const gage_02Img = new Image(); gage_02Img.src = 'assets/image/gage_02.png';
    const gage_03Img = new Image(); gage_03Img.src = 'assets/image/gage_03.png';
    const gage_04Img = new Image(); gage_04Img.src = 'assets/image/gage_04.png';
    const gage_05Img = new Image(); gage_05Img.src = 'assets/image/gage_05.png';
    const gage_06Img = new Image(); gage_06Img.src = 'assets/image/gage_06.png';
    const gage_07Img = new Image(); gage_07Img.src = 'assets/image/gage_07.png';
    const gage_08Img = new Image(); gage_08Img.src = 'assets/image/gage_08.png';
    const gage_09Img = new Image(); gage_09Img.src = 'assets/image/gage_09.png';
    const gage_10_1Img = new Image(); gage_10_1Img.src = 'assets/image/gage_10_1.png';
    const gage_10_2Img = new Image(); gage_10_2Img.src = 'assets/image/gage_10_2.png';
    const gage_10_3Img = new Image(); gage_10_3Img.src = 'assets/image/gage_10_3.png';
    const gage_10_4Img = new Image(); gage_10_4Img.src = 'assets/image/gage_10_4.png';
    const gage_10_5Img = new Image(); gage_10_5Img.src = 'assets/image/gage_10_5.png';
    const intro_02Img = new Image(); intro_02Img.src = 'assets/image/intro_02.png';
    const intro_text_01Img = new Image(); intro_text_01Img.src = 'assets/image/intro_text_01.png';
    const intro_text_02Img = new Image(); intro_text_02Img.src = 'assets/image/intro_text_02.png';
    const game_bg_moonImg = new Image(); game_bg_moonImg.src = 'assets/image/game_bg_moon.png';
    const game_bg_cloud_04Img = new Image(); game_bg_cloud_04Img.src = 'assets/image/game_bg_cloud_04.png';
    const game_bg_cloud_05Img = new Image(); game_bg_cloud_05Img.src = 'assets/image/game_bg_cloud_05.png';
    const game_bg_mountainImg = new Image(); game_bg_mountainImg.src = 'assets/image/game_bg_mountain.png';
    const intro_popupImg = new Image(); intro_popupImg.src = 'assets/image/intro_popup.png';
    const result_popup_bgImg = new Image(); result_popup_bgImg.src = 'assets/image/result_popup_bg.png';
    const result_character_01Img = new Image(); result_character_01Img.src = 'assets/image/result_character_01.png';
    const result_character_02Img = new Image(); result_character_02Img.src = 'assets/image/result_character_02.png';
    const result_character_03Img = new Image(); result_character_03Img.src = 'assets/image/result_character_03.png';
    const ranking_character_01Img = new Image(); ranking_character_01Img.src = 'assets/image/ranking_character_01.png';
    const ranking_character_02Img = new Image(); ranking_character_02Img.src = 'assets/image/ranking_character_02.png';
    const ranking_character_03Img = new Image(); ranking_character_03Img.src = 'assets/image/ranking_character_03.png';
    const ranking_shape_01Img = new Image(); ranking_shape_01Img.src = 'assets/image/ranking_shape_01.png';
    const ranking_icon_01Img = new Image(); ranking_icon_01Img.src = 'assets/image/ranking_icon_01.png';
    const ranking_icon_02Img = new Image(); ranking_icon_02Img.src = 'assets/image/ranking_icon_02.png';
    const ranking_icon_03Img = new Image(); ranking_icon_03Img.src = 'assets/image/ranking_icon_03.png';
    const ranking_shape_02_arrowImg = new Image(); ranking_shape_02_arrowImg.src = 'assets/image/ranking_shape_02_arrow.png';
    const ranking_shape_02Img = new Image(); ranking_shape_02Img.src = 'assets/image/ranking_shape_02.png';
    const alarm_iconImg = new Image(); alarm_iconImg.src = 'assets/image/alarm_icon.png';
    const videoplaybackSound = new Audio('assets/audio/videoplayback.mp3');
    const CSC018Sound = new Audio('assets/audio/CSC018.mp3');

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
    this._resources.set('character_03_1Img', character_03_1Img);
    this._resources.set('character_04Img', character_04Img);
    this._resources.set('character_2_01Img', character_2_01Img);
    this._resources.set('character_2_02Img', character_2_02Img);
    this._resources.set('character_2_03_1Img', character_2_03_1Img);
    this._resources.set('character_2_03_2Img', character_2_03_2Img);
    this._resources.set('character_2_04Img', character_2_04Img);
    this._resources.set('character_3_01Img', character_3_01Img);
    this._resources.set('character_3_02Img', character_3_02Img);
    this._resources.set('character_3_03_1Img', character_3_03_1Img);
    this._resources.set('character_3_03_2Img', character_3_03_2Img);
    this._resources.set('character_3_04Img', character_3_04Img);
    this._resources.set('effect_character02Img', effect_character02Img);
    this._resources.set('effect_character03Img', effect_character03Img);
    this._resources.set('effect_character04_3Img', effect_character04_3Img);
    this._resources.set('effect_character04_4Img', effect_character04_4Img);
    this._resources.set('ic_wifi_connectImg', ic_wifi_connectImg);
    this._resources.set('character_right_bgImg', character_right_bgImg);
    this._resources.set('gage_00Img', gage_00Img);
    this._resources.set('gage_01Img', gage_01Img);
    this._resources.set('gage_02Img', gage_02Img);
    this._resources.set('gage_03Img', gage_03Img);
    this._resources.set('gage_04Img', gage_04Img);
    this._resources.set('gage_05Img', gage_05Img);
    this._resources.set('gage_06Img', gage_06Img);
    this._resources.set('gage_07Img', gage_07Img);
    this._resources.set('gage_08Img', gage_08Img);
    this._resources.set('gage_09Img', gage_09Img);
    this._resources.set('gage_10_1Img', gage_10_1Img);
    this._resources.set('gage_10_2Img', gage_10_2Img);
    this._resources.set('gage_10_3Img', gage_10_3Img);
    this._resources.set('gage_10_4Img', gage_10_4Img);
    this._resources.set('gage_10_5Img', gage_10_5Img);
    this._resources.set('intro_02Img', intro_02Img);
    this._resources.set('intro_text_01Img', intro_text_01Img);
    this._resources.set('intro_text_02Img', intro_text_02Img);
    this._resources.set('game_bg_moonImg', game_bg_moonImg);
    this._resources.set('game_bg_cloud_04Img', game_bg_cloud_04Img);
    this._resources.set('game_bg_cloud_05Img', game_bg_cloud_05Img);
    this._resources.set('game_bg_mountainImg', game_bg_mountainImg);
    this._resources.set('intro_popupImg', intro_popupImg);
    this._resources.set('result_popup_bgImg', result_popup_bgImg);
    this._resources.set('result_character_01Img', result_character_01Img);
    this._resources.set('result_character_02Img', result_character_02Img);
    this._resources.set('result_character_03Img', result_character_03Img);
    this._resources.set('ranking_character_01Img', ranking_character_01Img);
    this._resources.set('ranking_character_02Img', ranking_character_02Img);
    this._resources.set('ranking_character_03Img', ranking_character_03Img);
    this._resources.set('ranking_shape_01Img', ranking_shape_01Img);
    this._resources.set('ranking_icon_01Img', ranking_icon_01Img);
    this._resources.set('ranking_icon_02Img', ranking_icon_02Img);
    this._resources.set('ranking_icon_03Img', ranking_icon_03Img);
    this._resources.set('ranking_shape_02_arrowImg', ranking_shape_02_arrowImg);
    this._resources.set('ranking_shape_02Img', ranking_shape_02Img);
    this._resources.set('alarm_iconImg', alarm_iconImg);
    this._resources.set('videoplaybackSound', videoplaybackSound);
    this._resources.set('CSC018Sound', CSC018Sound);

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

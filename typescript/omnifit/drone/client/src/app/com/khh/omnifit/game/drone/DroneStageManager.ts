import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {ValidUtil} from '../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ObjDrone} from './obj/ObjDrone';
import {DroneStage} from './stage/DroneStage';

export class DroneStageManager extends DroneStage {

  private static instance: DroneStageManager;

  private position = 0;
  private stages: DroneStage[];
  private _webSocket: WebSocket;
  private _webSocketSubject: Subject<Telegram<any>>;
  // private clockSubscription: Subscription;

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance(canvas?: HTMLCanvasElement, objs?: ObjDrone[]) {
    if (!DroneStageManager.instance) {
      DroneStageManager.instance = new DroneStageManager(canvas, objs);
    }
    return DroneStageManager.instance;
  }

  private constructor(canvas: HTMLCanvasElement, objs: ObjDrone[] = new Array<ObjDrone>()) {
    super(canvas, objs);
    // this.clockInterval = 10;
    this.stages = new Array<DroneStage>();
    this._webSocket = new WebSocket('ws://192.168.13.58:8999');
    const observable = Observable.create((obs: Observer<MessageEvent>) => {
        this._webSocket.onmessage = obs.next.bind(obs);
        this._webSocket.onerror = obs.error.bind(obs);
        this._webSocket.onclose = obs.complete.bind(obs);
        //return this._webSocket.close.bind(this._webSocket);
      });
    const observer = {
      next: (data: any) => {
        if (this._webSocket.readyState === WebSocket.OPEN) {
          this._webSocket.send(JSON.stringify(data));
        }
      },
      error : (error: any) => {
        console.log('error websocket');
      },
    };
    this._webSocketSubject = Subject.create(observer as Observer<any>, observable).map((response: MessageEvent): Telegram<any> => {
      const data = JSON.parse(response.data) as Telegram<any>;
      return data;
    });
  }

  get webSocket(): WebSocket {
    return this._webSocket;
  }

  get webSocketSubject(): Subject<Telegram<any>> {
    return this._webSocketSubject;
  }

  public nextPosition(): number {
    let p = this.position;
    p++;
    if (p >= this.stages.length) { p = this.stages.length - 1; }
    return p;
  }
  public previousPosition(): number {
    let p = this.position;
    p--;
    if (p < 0) { p = 0; }
    return p;
  }

  public goStage(idx: number, data?: any): DroneStage {
    console.log('goStage ' + idx + ' ' + data);
    this.currentStage().onStop(data);
    const nextStage: DroneStage = this.stages[idx];
    nextStage.onStart(data);
    this.position = idx;
    return nextStage;
  }

  public nextStage(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.nextPosition();
    const nextStage: DroneStage = this.stages[this.position];
    nextStage.onStart(data);
    return nextStage;
  }

  public previousStage(data?: any): DroneStage {
    this.currentStage().onStop(data);
    this.position = this.previousPosition();
    const previousStage: DroneStage = this.stages[this.position];
    previousStage.onStart(data);
    return previousStage;
  }

  public pushStage(stage: DroneStage): void {
    this.stages.push(stage);
  }

  public currentStage(): DroneStage {
    return this.stages[this.position];
  }

  eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return undefined;
  }

  onDraw(): void {

  }

  onCreate(canvas: HTMLCanvasElement) {
    this.position = 0;
    this.objs.forEach((it) => it.onStop());
    this.currentStage().onCreate({data: 'start'});
  }

  onStart(data?: any): void {
    // this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.objs.forEach((it) => it.onStart());
    this.currentStage().onStart(data);
  }
  onPause(data?: any) {
    this.objs.forEach((it) => it.onPause());
    this.currentStage().onPause(data);
  }
  onRestart(data?: any) {
    this.objs.forEach((it) => it.onRestart());
    this.currentStage().onRestart(data);
  }
  onResume(data?: any) {
    this.objs.forEach((it) => it.onResume());
    this.currentStage().onResume(data);
  }
  onStop(data?: any) {
    this.objs.forEach((it) => it.onResume());
    this.currentStage().onStop(data);
    if (!ValidUtil.isNullOrUndefined(this._webSocketSubject)) { this._webSocketSubject.unsubscribe(); }
    // if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
  }
  onDestroy(data?: any) {
    this.stages.forEach((it) => it.onDestroy(data));
    this.stages.length = 0;
  }

  getObjs(stage: DroneStage): ObjDrone[] {
    return this.objs.map((it) => {
      it.stage = stage;
      return it;
    });
  }
}

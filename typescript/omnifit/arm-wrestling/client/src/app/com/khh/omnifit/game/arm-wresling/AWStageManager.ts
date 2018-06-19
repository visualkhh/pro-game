import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Telegram';
import {ValidUtil} from '../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ObjAW} from './obj/ObjAW';
import {AWStage} from './stage/AWStage';

export class AWStageManager extends AWStage {

  private static instance: AWStageManager;

  private position = 0;
  private stages: AWStage[];
  private _webSocket: WebSocket;
  private _webSocketSubject: Subject<Telegram<any>>;
  // private clockSubscription: Subscription;

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance(canvas?: HTMLCanvasElement, objs?: ObjAW[]) {
    if (!AWStageManager.instance) {
      AWStageManager.instance = new AWStageManager(canvas, objs);
    }
    return AWStageManager.instance;
  }

  private constructor(canvas: HTMLCanvasElement, objs: ObjAW[] = new Array<ObjAW>()) {
    super(canvas, objs);
    // this.clockInterval = 10;
    this.stages = new Array<AWStage>();
    // this._webSocket = new WebSocket('ws://192.168.13.58:8999');
    this._webSocket = new WebSocket('ws://119.206.205.171:8999');
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

  public goStage(idx: number, data?: any): AWStage {
    console.log('goStage ' + idx + ' ' + data);
    this.currentStage().onStop(data);
    const nextStage: AWStage = this.stages[idx];
    nextStage.onStart(data);
    this.position = idx;
    return nextStage;
  }

  public nextStage(data?: any): AWStage {
    this.currentStage().onStop(data);
    this.currentStage().onDestroy(data);
    this.position = this.nextPosition();
    const nextStage: AWStage = this.stages[this.position];
    nextStage.onCreate(data);
    nextStage.onStart(data);
    return nextStage;
  }

  public previousStage(data?: any): AWStage {
    this.currentStage().onStop(data);
    this.currentStage().onDestroy(data);
    this.position = this.previousPosition();
    const previousStage: AWStage = this.stages[this.position];
    previousStage.onCreate(data);
    previousStage.onStart(data);
    return previousStage;
  }

  public pushStage(stage: AWStage): void {
    this.stages.push(stage);
  }

  public currentStage(): AWStage {
    return this.stages[this.position];
  }

  eventObservable(eventName: string): Observable<any> {
    return undefined;
  }

  onDraw(): void {

  }

  onCreate(canvas?: HTMLCanvasElement) {
    this.position = 0;
    this.objs.forEach((it) => it.onCreate());
    this.currentStage().onCreate({data: 'start'});
  }

  onStart(data?: any): void {
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
  }
  onDestroy(data?: any) {
    this.objs.forEach((it) => it.onDestroy());
    this.stages.forEach((it) => it.onDestroy(data));
    this.stages.length = 0;
  }

  getAllObjs(stage: AWStage): ObjAW[] {
    const r =  this.objs.map((it) => {
      it.stage = stage;
      return it;
    }).concat(stage.objs).sort((n1, n2) => {
      //(n1.index > n2.index ? 1 : -1)
      if (n1.index > n2.index) {
        return 1;
      }
      if (n1.index < n2.index) {
        return -1;
      }
      return 0;
    });
    return r;
  }
}

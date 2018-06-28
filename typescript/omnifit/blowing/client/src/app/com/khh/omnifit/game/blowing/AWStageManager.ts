import {Observable} from 'rxjs/Observable';
import {AWObj} from './obj/AWObj';
import {AWStage} from './stage/AWStage';

export class AWStageManager extends AWStage {

  private static instance: AWStageManager;

  private position = 0;
  private stages = new Array<AWStage>();

  //singletone pattern
  //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
  static getInstance(canvas?: HTMLCanvasElement, objs?: AWObj[]) {
    if (!AWStageManager.instance) {
      AWStageManager.instance = new AWStageManager(canvas, objs);
    }
    return AWStageManager.instance;
  }

  private constructor(canvas: HTMLCanvasElement, objs: AWObj[] = new Array<AWObj>()) {
    super(canvas, objs);
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
  }
  onDestroy(data?: any) {
    this.objs.forEach((it) => it.onDestroy());
    this.stages.forEach((it) => it.onDestroy(data));
    this.stages.length = 0;
  }

  getAllObjs(stage: AWStage): AWObj[] {
    const r =  this.objs.map((it) => {
      it.stage = stage;
      return it;
    }).concat(stage.objs).sort((n1, n2) => {
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

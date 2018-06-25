import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {AWStageManager} from '../AWStageManager';
import {AWObj} from '../obj/AWObj';
import {AWStage} from './AWStage';

//websocket https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/
export class AWStageIntro extends AWStage {

  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;
  private clockSubscription: Subscription;
  private audio: HTMLAudioElement;

  constructor(canvas: HTMLCanvasElement, objs?: AWObj[]) {
    super(canvas, objs);
  }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);
    const x = this.width / 2;
    const y = this.height / 2;

    //objs draw
    AWStageManager.getInstance().getAllObjs(this).forEach( (it) => {
      this.resetContext(context);
      it.onDraw(context);
    });
    context.font = '100px Multicolore, Roboto-Thin';
    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach((it) => it.onCreate(data));
  }

  onStart(data?: any): void {
    console.log('intro onStart');
    // this.audio = ResourceManager.getInstance().resources('videoplaybackSound');
    // this.audio.play();
    this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.resizeSubscription = this.canvasEventSubscribe('resize', (evnet: Event) => this.onDraw());
    this.objs.forEach((it) => it.onStart(data));
    this.onDraw();
  }

  onStop(data?: any): void {
    console.log('intro onStop');
    // if (this.audio) {
    //   this.audio.pause();
    // }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) { this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
    this.objs.forEach((it) => it.onStop(data));
  }

  eventObservable(eventName: string): Observable<any> {
    return undefined;
  }
  onResume(data?: any) {this.objs.forEach((it) => it.onResume(data)); }
  onRestart(data?: any) {this.objs.forEach((it) => it.onRestart(data)); }
  onPause(data?: any) {this.objs.forEach((it) => it.onPause(data)); }
  onDestroy(data?: any) {this.objs.forEach((it) => it.onDestroy(data)); }
}

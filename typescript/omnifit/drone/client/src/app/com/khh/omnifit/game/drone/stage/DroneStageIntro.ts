import {Observable} from 'rxjs/Observable';
import {timer} from 'rxjs/observable/timer';
import {Subscription} from 'rxjs/Subscription';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DroneResourceManager} from '../DroneResourceManager';
import {DroneStageManager} from '../DroneStageManager';
import {ObjDrone} from '../obj/ObjDrone';
import {DroneStage} from './DroneStage';

//websocket https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/
export class DroneStageIntro extends DroneStage {

  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;
  private clockSubscription: Subscription;
  private websocketSubscription: Subscription;
  private audio: HTMLAudioElement;

  constructor(canvas: HTMLCanvasElement, objs?: ObjDrone[]) {
    super(canvas, objs);
  }

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    context.clearRect(0, 0, this.width, this.height);
    const x = this.width / 2;
    const y = this.height / 2;
    // context.font = '50pt Calibri';
    // context.textAlign = 'center';
    // context.fillStyle = 'blue';
    // context.fillText('show me the 123--', x, y);
    // context.fillText('드론을 높게 띄어봅시다.', x, y + 15);
    // context.fillText('(시작하기)(' + WebSocket.CLOSED + ', ' + WebSocket.OPEN + '(open), ' + WebSocket.CLOSING + ', ' + WebSocket.CONNECTING + ')' + DroneStageManager.getInstance().webSocket.readyState, x, y + 30);

    //objs draw
    DroneStageManager.getInstance().getAllObjs(this).forEach( (it) => {
      this.resetContext(context);
      it.onDraw(context);
    });
    // context.font = 'bold  80pt Calibri' ;
    // context.font = 'bold  80pt Multicolore' ;
    // context.font = '100px Futura, Helvetica, sans-serif';
    context.font = '100px Multicolore, Roboto-Thin';
    const blur = 10;
    // const width = context.measureText('show me the money 123,456').width + blur * 2;
    // context.textBaseline = 'top'
    // context.shadowColor = '#000'
    // context.shadowOffsetX = width;
    // context.shadowOffsetY = 0;
    // context.shadowBlur =
    // context.save()
    // context.strokeStyle = '#000000';
    // // context.shadowColor = '#000000';
    // // context.shadowOffsetX = -1;
    // // context.shadowOffsetY = -1;
    // context.fillStyle = '#FFFFFF';
    // context.lineWidth = 2;
    // // const gradient = context.createLinearGradient(0, 0, 150, 100);
    // // gradient.addColorStop(0, 'rgb(255, 0, 128)');
    // // gradient.addColorStop(1, 'rgb(255, 153, 51)');
    // // context.fillStyle = gradient;
    // context.fillText('show me the money 123,456', x, y);
    // context.strokeText('show me the money 123,456', x, y);
    // // context.fill();
    // context.restore();
    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach((it) => it.onCreate(data));
  }

  onStart(data?: any): void {
    console.log('intro onStart');

    // timer(10000).subscribe( (it) => {
    //   document.getElementById('audio').play();
    // })
    this.audio = DroneResourceManager.getInstance().resources('videoplaybackSound');
    // this.audio = new Audio();
    // this.audio.src = 'assets/audio/videoplayback.mp3'
    // this.audio.controls = true;
    // this.audio.autoplay = true;
    this.audio.play();
    // this.audio.load();
    // document.getElementById('audio').oncanplaythrough = () => {
    //   this.objs[0].onDraw = (a) => {};
    //   document.getElementById('audio').play() ;
    //   DroneResourceManager.getInstance().resources('videoplaybackSound').play();
    // };

    // this.audio.onended = () => {
    //   this.objs[0].onDraw = (a) => {};
    // };
    // this.audio.addEventListener('ended', () => {
    //   this.audio.play();
    //   this.objs[0].onDraw = (a) => {};
    // }, false);
    //this.audio.play();
    // });
    // this.audio.oncanplaythrough = () => {
    //   this.audio.play();
    //   this.objs[0].onDraw = (a) => {};
    // }
    // this.audio.ended = () => {
    //   this.audio.play();
    //   this.objs[0].onDraw = (a) => {};
    // }
    this.websocketSubscription = DroneStageManager.getInstance().webSocketSubject.filter((telegram) => telegram.action === 'welcome').subscribe((telegram) => {
      console.log('telegram Intro ' + telegram);
    });
    this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.resizeSubscription = this.canvasEventSubscribe('resize', (evnet: Event) => this.onDraw());
    //this.mouseDownSubscription = this.canvasEventSubscribe('mousedown', (event: MouseEvent) => DroneStageManager.getInstance().nextStage());
    this.objs.forEach((it) => it.onStart(data));
    this.onDraw();
  }

  onStop(data?: any): void {
    console.log('intro onStop');
    if (this.audio) {
      this.audio.pause();
    }
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) { this.resizeSubscription.unsubscribe(); }
    //if (!ValidUtil.isNullOrUndefined(this.mouseDownSubscription)) { this.mouseDownSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.websocketSubscription)) { this.websocketSubscription.unsubscribe(); }
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

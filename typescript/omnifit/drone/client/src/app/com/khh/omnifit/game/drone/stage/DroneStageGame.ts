import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../drive/DeviceManager';
import {DroneStageManager} from '../DroneStageManager';
import {DroneStage} from './DroneStage';
import {Drone} from '../obj/drone/Drone';
import {DroneResourceManager} from '../DroneResourceManager';

//공기 및 유체 저항
//https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/air-and-fluid-resistance
export class DroneStageGame extends DroneStage {

  public static readonly EVENT_WIND = 'WIND';
  public static readonly EVENT_CONCENTRATION = 'CONCENTRATION';

  private resizeSubscription: Subscription;
  private eventSubscribes: Map<string, Observable<any>>;
  private clockSubscription: Subscription;
  private wind = new PointVector();
  private windIntervalSubscription: Subscription;
  private concentrationSubscription: Subscription;

  private drons: Map<string, Drone> = new Map<string, Drone>();
  private websocketSubscription: Subscription;

  onDraw(): void {
    const context: CanvasRenderingContext2D = this.bufferCanvas.getContext('2d');
    const x = this.width / 2;
    const y = this.height / 2;

    context.font = '30pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'pink';
    context.fillRect(0, 0, this.width, this.height);
    context.fillStyle = 'blue';
    context.fillText('********GAME********', x, y);

    //objs draw
    this.objs.forEach((it) => it.onDraw(context));
    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach((it) => it.onCreate(data));
  }
  onStart(data?: any): void {

    const windObservable = interval(50).map( (n) => this.wind);
    this.eventSubscribes = new Map<string, Observable<any>>();
    this.eventSubscribes.set(DroneStageGame.EVENT_WIND, windObservable);

    this.objs.forEach((it) => it.onStart());
    this.onDraw();
    this.windIntervalSubscription = interval(50).subscribe( (n) => this.wind = this.createRandomWind());
    this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.resizeSubscription = this.canvasEventSubscribe('resize', (event: Event) => this.onDraw());
    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
      if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
        DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {headsetConcentration: concentration}));
      }
    });

    //online offline
    if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
      this.websocketSubscription = DroneStageManager.getInstance().webSocketSubject.filter((telegram) => telegram.action === 'rooms' && telegram.method === 'detail').subscribe((telegram) => {
        console.log('telegram game ' + telegram);
        (telegram.body as any[]).forEach((it) => {
          let drone = this.drons.get(it.uuid);
          if (ValidUtil.isNullOrUndefined(drone)) {
            drone = this.addDrone(it.uuid);
          }
        });
      });
    }else {
      this.addDrone('local');
    }
  }

  onStop(data?: any): void {
    this.objs.forEach((it) => it.onStop(data));
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.windIntervalSubscription)) { this.windIntervalSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.websocketSubscription)) {this.websocketSubscription.unsubscribe(); }
  }

  private createRandomWind(): PointVector {
    return new PointVector(Math.floor(RandomUtil.random((this.width / 3) * -1, this.width / 3)));
  }

  eventSubscribe(eventName: string, next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.eventSubscribes.get(eventName).subscribe(next, error, complete);
  }

  addDrone(id: string): Drone {
    const droneImg = DroneResourceManager.getInstance().resources.get('droneImg');
    const drone = new Drone(this, 0, 0, 20, droneImg);
    drone.id = id;
    drone.onStart();
    this.drons.set(id, drone);
    this.objPush(drone);
    return drone;
  }

  onDestroy(data?: any) {
    this.objs.forEach((it) => it.onDestroy(data));
  }

  onPause(data?: any) {
    this.objs.forEach((it) => it.onPause(data));
  }

  onRestart(data?: any) {
    this.objs.forEach((it) => it.onRestart(data));
  }

  onResume(data?: any) {
    this.objs.forEach((it) => it.onResume(data));
  }
}

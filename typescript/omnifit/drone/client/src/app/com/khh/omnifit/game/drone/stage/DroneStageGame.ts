import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Telegram} from '../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {CollectionUtil} from '../../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {ConvertUtil} from '../../../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {DeviceManager} from '../../../drive/DeviceManager';
import {DroneResourceManager} from '../DroneResourceManager';
import {DroneStageManager} from '../DroneStageManager';
import {ReadyButton} from '../obj/button/ReadyButton';
import {Drone} from '../obj/drone/Drone';
import {DroneStage} from './DroneStage';
import {ServerTelegram} from '../../../../../../../../../server/src/com/khh/omnifit/game/drone/dto/ServerTelegram';

//공기 및 유체 저항
//https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/air-and-fluid-resistance
export class DroneStageGame extends DroneStage {

  private resizeSubscription: Subscription;
  private keySubscription: Subscription;
  private eventSubscribes: Map<string, Observable<any>>;
  private clockSubscription: Subscription;
  private concentrationSubscription: Subscription;

  private drones: Map<string, Drone> = new Map<string, Drone>();
  private websocketSubscription: Subscription;
  private hostDroneId: string;
  private concentrationSubject: BehaviorSubject<any>;
  private headsetConcentrationHistory: number[];
  private headsetConcentration: number;
  private roomUUID = 'local';
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
    DroneStageManager.getInstance().getAllObjs(this).forEach( (it) => {
      this.resetContext(context);
      it.onDraw(context);
    });
    this.flushBufferToCanvas();
  }

  onCreate(data?: any): void {
    this.objs.forEach((it) => it.onCreate(data));
  }
  onStart(data?: any): void {
    console.log('game start');
    this.concentrationSubject = new BehaviorSubject({});
    this.eventSubscribes = new Map<string, Observable<any>>();
    this.eventSubscribes.set(DroneStageGame.EVENT_CONCENTRATION, this.concentrationSubject);
    this.headsetConcentrationHistory = new Array<number>();
    this.objs.forEach((it) => it.onStart());

    this.clockSubscription = this.clockIntervalSubscribe((date: number) => this.onDraw());
    this.resizeSubscription = this.canvasEventSubscribe('resize', (event: Event) => this.onDraw());
    this.keySubscription = DeviceManager.getInstance().fromeEvent('keydown', (e: KeyboardEvent) => {
      let at = (this.headsetConcentration || 0);
      if ('ArrowUp' === e.key) {
        at++;
      }else if ('ArrowDown' === e.key) {
        at--;
      }
      at = Math.min(9, at);
      at = Math.max(0, at);
      // this.concentrationSubject.next({uuid: 'local', headsetConcentration: this.headsetConcentration});
      DeviceManager.getInstance().dispatchCustomEvent(new CustomEvent(DeviceManager.EVENT_OMNIFIT_HEADSET_CONCENTRATION, {detail: at}));
    });

    this.concentrationSubscription = DeviceManager.getInstance().headsetConcentrationSubscribe((concentration) => {
      this.headsetConcentration = concentration;
      this.headsetConcentrationHistory.push(concentration);
      this.concentrationSubject.next({uuid: 'local', headsetConcentration: concentration, headsetConcentrationHistory: this.headsetConcentrationHistory});
      if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
        DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('profile', 'put', {headsetConcentration: concentration, headsetConcentrationUpdate: new Date().getTime(), headsetConcentrationHistory: this.headsetConcentrationHistory}));
      }
    });

    //online offline
    if (DroneStageManager.getInstance().webSocket.readyState === WebSocket.OPEN) {
      DroneStageManager.getInstance().webSocketSubject.next(new Telegram<any>('rooms/join', 'put'));
      this.websocketSubscription = DroneStageManager.getInstance().webSocketSubject.filter((telegram) => telegram.action === 'rooms' && telegram.method === 'detail').subscribe((telegram) => {
        console.log('telegram game ' + telegram);
        const users = telegram.body.users as any[];
        const wjumpSize = this.width / (users.length + 1);
        let wjump = 0;
        //유저 정리
        CollectionUtil.ignoreMapItem(this.drones, new Set(users.map((it) => it.uuid)), (it) => this.removeObjOnStopDestory(it));
        users.forEach((it) => {
          let drone  = this.drones.get(it.uuid);
          if (ValidUtil.isNullOrUndefined(drone)) {
            drone = this.pushDroneOnCreateStart(it.uuid, it.host);
          }
          if ('host' === it.host) {
            this.hostDroneId = it.uuid;
          }else if ('other' === it.host) {
          }
          wjump += wjumpSize;
          drone.initX = wjump;
          this.concentrationSubject.next(it);
        });
      });
    }else {
      this.hostDroneId = 'local';
      this.pushDroneOnCreateStart(this.hostDroneId, 'host');
    }

    //첫번째 드론이 내꺼 이면은 시작하기 버튼 나와라
    // const s = ConvertUtil.iteratorToArray(this.drones.values());
    // console.log('drones  ' + s[0].host)
    // if ('host' === s[0].host) {
    //   const readyButton = new ReadyButton(this, 0, 0, 0, DroneResourceManager.getInstance().resources('game_bg_mountainImg'));
    //   readyButton.index = 600;
    //   this.pushObjCreateStart(readyButton);
    // }

  }

  onStop(data?: any): void {
    console.log('game stop');
    this.objs.forEach((it) => it.onStop(data));
    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.websocketSubscription)) {this.websocketSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.keySubscription)) {this.keySubscription.unsubscribe(); }
  }

  private createRandomWind(): PointVector {
    return new PointVector(Math.floor(RandomUtil.random((this.width / 3) * -1, this.width / 3)));
  }

  eventObservable(eventName: string): Observable<any> {
    // return this.eventSubscribes.get(eventName).subscribe(next, error, complete);
    return this.eventSubscribes.get(eventName);
  }

  pushDroneOnCreateStart(id: string, host?: string): Drone {
    let drone = this.drones.get(id);
    if (!ValidUtil.isNullOrUndefined(drone)) {
      this.removeObjOnStopDestory(drone);
    }

    const droneImg = DroneResourceManager.getInstance().resources('character_01Img');
    // if ('host' === host) {
    //   droneImg = DroneResourceManager.getInstance().resources('character_01Img');
    // }
    drone = new Drone(this, 0, 0, 0, droneImg);
    drone.index = this.objs.length + 500;
    drone.id = id;
    drone.host = host;
    drone.onCreate();
    drone.onStart();
    this.drones.set(id, drone);
    this.pushObj(drone);
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

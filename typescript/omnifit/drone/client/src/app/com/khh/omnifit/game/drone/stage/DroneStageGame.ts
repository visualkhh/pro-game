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
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {Room} from '../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';
import {Telegram} from '../../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {CollectionUtil} from '../../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {ConvertUtil} from '../../../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';
import {PointVector} from '../../../../../../../../../lib-typescript/com/khh/math/PointVector';
import {RandomUtil} from '../../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ServerTelegram} from '../../../../../../../../../server/src/com/khh/omnifit/game/drone/dto/ServerTelegram';
import {DeviceManager} from '../../../drive/DeviceManager';
import {DroneResourceManager} from '../DroneResourceManager';
import {DroneStageManager} from '../DroneStageManager';
import {ReadyButton} from '../obj/button/ReadyButton';
import {Drone} from '../obj/drone/Drone';
import {DroneStage} from './DroneStage';
import {DroneStageEvent} from './DronStageEvent';

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
  private roomDetailSubject: BehaviorSubject<Room<any>>;
  // private roomDetailSubScription: Subscription;
  private localRoomIntervalSubScription: Subscription;
  private headsetConcentrationHistory: number[];
  private headsetConcentration: number;
  private room = new Room<any>();
  private audio: HTMLAudioElement;
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
    this.audio = new Audio('assets/audio/CSC018.mp3') ;
    this.audio.play();
    this.concentrationSubject = new BehaviorSubject({});
    this.eventSubscribes = new Map<string, Observable<any>>();
    this.eventSubscribes.set(DroneStageEvent.EVENT_CONCENTRATION, this.concentrationSubject);
    this.roomDetailSubject = new BehaviorSubject(new Room<any>());
    this.eventSubscribes.set(DroneStageEvent.EVENT_ROOM_DETAIL, this.roomDetailSubject);
    this.headsetConcentrationHistory = new Array<number>();
    this.room = new Room<any>();
    this.objs.forEach((it) => it.onStart());

    // this.roomDetailSubScription = this.roomDetailSubject.subscribe( (it: Room<any>) => {
    //   if (it.status === 'end') {
    //     DroneStageManager.getInstance().nextStage(it);
    //   }
    //
    //   for (const user of it.users) {
    //     let finishCnt = 3;
    //     (user.headsetConcentrationHistory as number[]).forEach((cit) => cit >= 9 ? finishCnt-- : finishCnt = 3);
    //     console.log('-- ' + finishCnt);
    //     if (finishCnt <= 0) {
    //       DroneStageManager.getInstance().nextStage(it);
    //       break;
    //     }
    //   }
    //   // const history = concentration.headsetConcentrationHistory || new Array<number>();
    //   // history.forEach( (it) => it >= 9 ? this.finishCnt-- : this.finishCnt = 3);
    // });

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
        this.roomDetailSubject.next(this.room = telegram.body);
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
      this.room.users = [{uuid: this.hostDroneId, host: 'host', headsetConcentrationHistory: this.headsetConcentrationHistory, headsetConcentration: this.headsetConcentration}];
      this.localRoomIntervalSubScription = interval(1000).subscribe( (it) => {
        console.log(this.room.users.length + ' ' + this.room.startCnt + ' ' + this.room.endCnt)
        if (this.room.startCnt > 0) {
          this.room.startCnt = (--this.room.startCnt);
          this.room.status = 'wait';
        }else if (this.room.startCnt <= 0 && this.room.endCnt > 0) {
          if (this.room.endCnt >= 60) {
            this.headsetConcentrationHistory = new Array<number>();
          }
          this.room.endCnt = (--this.room.endCnt);
          this.room.status = 'run';
        }else if (this.room.startCnt <= 0 && this.room.endCnt <= 0) {
          this.room.status = 'end';
        }
        this.room.users[0].headsetConcentrationHistory = this.headsetConcentrationHistory;
        this.room.users[0].headsetConcentration = this.headsetConcentration;
        let finishCnt = 3;
        (this.room.users[0].headsetConcentrationHistory as number[]).forEach((cit) => cit >= 9 ? finishCnt-- : finishCnt = 3);
        if (this.room.status === 'run' && finishCnt <= 0) {
          this.room.status = 'end';
        }
        this.roomDetailSubject.next(this.room);
      });
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
    this.audio.pause();
    this.objs.forEach((it) => it.onStop(data));
    Array.from(this.drones.values()).forEach( (it) => CollectionUtil.removeArrayItem(this.objs, it));
    this.drones.clear();

    if (!ValidUtil.isNullOrUndefined(this.resizeSubscription)) {this.resizeSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.clockSubscription)) { this.clockSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.concentrationSubscription)) {this.concentrationSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.websocketSubscription)) {this.websocketSubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.keySubscription)) {this.keySubscription.unsubscribe(); }
    if (!ValidUtil.isNullOrUndefined(this.localRoomIntervalSubScription)) {this.localRoomIntervalSubScription.unsubscribe(); }
    // if (!ValidUtil.isNullOrUndefined(this.roomDetailSubScription)) {this.roomDetailSubScription.unsubscribe(); }
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

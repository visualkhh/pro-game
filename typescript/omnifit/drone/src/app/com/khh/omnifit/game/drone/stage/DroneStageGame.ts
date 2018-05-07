import {Stage} from '../../../../stage/Stage';
import {DroneStageEnd} from './DroneStageEnd';
import {ClockStage} from '../../../../stage/ClockStage';
import {DroneStage} from './DroneStage';
import {Clock} from '../../../../clock/Clock';
import {Subscription} from 'rxjs/Subscription';
import {DroneStageManager} from './DroneStageManager';
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/zip";
import "rxjs/add/observable/bindCallback";
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ObjImg} from '../../../../graphics/ObjImg';
import {Obj} from '../../../../obj/Obj';
import {Cloud} from '../obj/cloud/Cloud';
import {Score} from '../obj/score/Score';
import {Drone} from '../obj/drone/Drone';
import {Gravity} from '../obj/gravity/Gravity';
import {Wind} from '../obj/wind/Wind';
import {Ground} from '../obj/ground/Ground';
import {ObjDrone} from '../obj/ObjDrone';
import {Intent} from '../../../../data/Intent';
import {MouseDummy} from '../obj/dummy/MouseDummy';
import {GravityDummy} from '../obj/dummy/GravityDummy';
import {ArcWaveDummy} from '../obj/dummy/ArcWaveDummy';


export class DroneStageGame extends DroneStage{
  private subscription: Subscription;
  private bufferCanvas: HTMLCanvasElement;


  constructor(clock: Clock, canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super(clock, canvas, objs);
    this.init();
  }
  private init() {


    //buffer canvas setting
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.width = this.canvas.width;
    this.bufferCanvas.height = this.canvas.height;


    //x,y,z
    let drone = new Drone(0, 0, 20,this.bufferCanvas);
    let cloud = new Cloud(0, 0, 10, this.bufferCanvas);
    let score = new Score(0, 0, 500, this.bufferCanvas);
    let ground = new Ground(0, 0, 5, this.bufferCanvas);
    let wind = new Wind(0, 0, 1);
    let gravity = new Gravity(0, 0, 0);

    this.objPush(cloud);
    // this.objPush(drone);
    this.objPush(score);
    for (let i = 0; i < 30; i++) {
      this.objPush(new MouseDummy(0, 0, 100, this.bufferCanvas));
    }
    // for (let i = 0; i < 2; i++) {
    //   this.objPush(new GravityDummy(0, 0, 100, this.bufferCanvas));
    // }
    // for (let i = 0; i < 2; i++) {
    //   this.objPush(new ArcWaveDummy(0, 0, 101, this.bufferCanvas));
    // }
    this.objPush(ground);
    this.objPush(gravity);
    this.objPush(wind);

  }


  mousedown(event: MouseEvent): void {
    super.mousedown(event);
    console.log({x: event.layerX, y: event.layerY});
    console.log('click Game: ' + event.offsetX + '/' + event.offsetY);
    this.objs.forEach(it=>it.mousedown(event));
    this.next();
  }


  mousemove(event: MouseEvent): void {
    super.mousemove(event);
    this.objs.forEach(it=>it.mousemove(event));
  }

  onDraw(): void {
    let context = this.canvas.getContext("2d");
    const width = this.canvas.width;
    const height = this.canvas.height;
    const x = width / 2;
    const y = height / 2;

    let ctxBuffer:CanvasRenderingContext2D = this.bufferCanvas.getContext("2d");
    ctxBuffer.canvas.width = width;
    ctxBuffer.canvas.height = height;
    ctxBuffer.font = '30pt Calibri';
    ctxBuffer.textAlign = 'center';
    ctxBuffer.fillStyle = 'pink';
    ctxBuffer.fillRect(0,0,width, height);
    ctxBuffer.fillStyle = 'blue';
    //console.log(this.canvas.width+"     "+height)
    ctxBuffer.fillText('********GAME********', x, y);
    //ctxBuffer.save();


    this.objs.forEach(it=>{
      it.clockSignal();
    });
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);






    //final draw
    context.drawImage(this.bufferCanvas,0,0);









  //   const droneImage = new Image() as HTMLImageElement;
  //   droneImage.src = "assets/image/drone.png"; // can also be a remote URL e.g. http://
  //   let dronObservable: Observable<Event> = Observable.fromEvent(droneImage,'load');
  //   dronObservable.subscribe((e: Event)=>{ctxBuffer.drawImage(droneImage,x - droneImage.width/2, y -  droneImage.height/2);});
  //   //
  //   const groundImage = new Image() as HTMLImageElement;
  //   groundImage.src = "assets/image/ground.png"; // can also be a remote URL e.g. http://
  //   let groundObservable: Observable<Event> = Observable.fromEvent(groundImage,'load');
  //   groundObservable.subscribe((e: Event)=>{ctxBuffer.drawImage(groundImage,x - groundImage.width/2, this.canvas.height -  groundImage.height);});
  //   //
  //   const cloudImage = new Image() as HTMLImageElement;
  //   cloudImage.src = "assets/image/cloud.png"; // can also be a remote URL e.g. http://
  //   let cloudObservable: Observable<Event> = Observable.fromEvent(groundImage,'load');
  //   cloudObservable.subscribe((e: Event)=>{ctxBuffer.drawImage(cloudImage,x - cloudImage.width/2, 0);});
  //   //
  //   let source = Observable.zip(
  //     dronObservable,
  //     groundObservable,
  //     cloudObservable,
  //     function (s1, s2, s3) {
  //       return s1 + ':' + s2 + ':' + s3;
  //     }
  //   );
  //   //
  //   let subscription = source.subscribe(x=>{
  //       // ctxBuffer.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //       context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //       context.drawImage(cnvsBuffer,0,0);
  //       console.log('Next: ' + x);
  //     },
  //     err=>{
  //       console.log('Error: ' + err);
  //     },
  //     ()=> {
  //       context.drawImage(cnvsBuffer,0,0);
  //     });
  //   context.drawImage(cnvsBuffer,0,0);
  }

  onStart(): void {
    super.onStart();
    this.subscription = this.clock.subscribe((x)=>{
      this.clockSignal(x)
    });
  }

  onStop(): void {
    super.onStop();
    this.clock.delete(this.subscription);
  }


  intentSignal(intent: Intent<number>) {
    console.log("intent game : "+intent.data);
    this.objs.forEach(it=>it.intentSignal(intent))
  }
}

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
import {Drone} from '../obj/drone/Drone';
import {Gravity} from '../obj/Gravity';
import {Wind} from '../obj/Wind';
import {Ground} from '../obj/ground/Ground';


export class DroneStageGame extends DroneStage{
  private subscription: Subscription;
  private bufferCanvas: HTMLCanvasElement;


  constructor(clock: Clock, canvas: HTMLCanvasElement) {
    super(clock, canvas);
    this.init();
  }
  private init() {


    //buffer canvas setting
    this.bufferCanvas = document.createElement('canvas');




    const droneImage = new Image() as HTMLImageElement;
    droneImage.src = "assets/image/drone.png";
    const groundImage = new Image() as HTMLImageElement;
    groundImage.src = "assets/image/ground.png";
    const cloudImage = new Image() as HTMLImageElement;
    cloudImage.src = "assets/image/cloud.png";

    //x,y,z
    let drone = new Drone(0, 0, 20,this.bufferCanvas, droneImage);
    let cloud = new Cloud(0, 0, 10, this.bufferCanvas, cloudImage);
    let ground = new Ground(0, 0, 5, this.bufferCanvas, groundImage);
    let wind = new Wind(0, 0, 1);
    let gravity = new Gravity(0, 0, 0);

    this.objPush(cloud);
    this.objPush(drone);
    this.objPush(ground);
    this.objPush(gravity);
    this.objPush(wind);

  }


  mousedown(event: MouseEvent): void {
    console.log({x: event.layerX, y: event.layerY});
    console.log('click Game: ' + event.offsetX + '/' + event.offsetY);
    this.next();
  }

  onDraw(): void {
    let context = this.canvas.getContext("2d");
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;


    let ctxBuffer:CanvasRenderingContext2D = this.bufferCanvas.getContext("2d");
    ctxBuffer.canvas.width = this.canvas.width;
    ctxBuffer.canvas.height = this.canvas.height;
    ctxBuffer.font = '30pt Calibri';
    ctxBuffer.textAlign = 'center';
    ctxBuffer.fillStyle = 'pink';
    ctxBuffer.fillRect(0,0,this.canvas.width, this.canvas.height);
    ctxBuffer.fillStyle = 'blue';
    console.log(this.canvas.width+"     "+this.canvas.height)
    ctxBuffer.fillText('********GAME********', x, y);
    //ctxBuffer.save();


    this.objs.forEach(it=>{
      it.clockSignal();
    });
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

  start(): void {
    this.onDraw();
    this.subscription = this.clock.subscribe((x)=>{
      this.clockSignal(x)
    });
  }

  stop(): void {
    console.log("dronStageGame Stop");
    this.clock.delete(this.subscription);
  }
}

import {DroneStage} from './DroneStage';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Cloud} from '../obj/cloud/Cloud';
import {Score} from '../obj/score/Score';
import {Drone} from '../obj/drone/Drone';
import {Wind} from '../obj/wind/Wind';
import {Ground} from '../obj/ground/Ground';
import {ObjDrone} from '../obj/ObjDrone';
import {interval} from 'rxjs/observable/interval';
import {RandomUtil} from '../../../../../../../../lib-typescript/com/khh/math/RandomUtil';
import {PointVector} from '../../../../../../../../lib-typescript/com/khh/math/PointVector';

//공기 및 유체 저항
//https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/air-and-fluid-resistance
export class DroneStageGame extends DroneStage{

  private bufferCanvas: HTMLCanvasElement;
  private windObservable: Observable<PointVector>;
  private resizeSubscription: Subscription;

  constructor(canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super(canvas, objs);
    this.init();
  }
  private init() {


    //buffer canvas setting
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.width = this.canvas.width;
    this.bufferCanvas.height = this.canvas.height;


    //x,y,z
    let drone = new Drone(this, 0, 0, 20,this.bufferCanvas);
    let cloud = new Cloud(this, 0, 0, 10, this.bufferCanvas);
    let score = new Score(this, 0, 0, 500, this.bufferCanvas);
    let wind = new Wind(this, 0, 0, 500, this.bufferCanvas);
    let ground = new Ground(this, 0, 0, 5, this.bufferCanvas);
    // let gravity = new Gravity(this, 0, 0, 0, this.bufferCanvas);

    this.objPush(cloud);
    this.objPush(drone);
    this.objPush(score);
    // for (let i = 0; i < 30; i++) {
    //   this.objPush(new MouseDummy(this, 0, 0, 100, this.bufferCanvas));
    // }
    // for (let i = 0; i < 2; i++) {
    //   this.objPush(new GravityDummy(this,0, 0, 100, this.bufferCanvas));
    // }
    // for (let i = 0; i < 2; i++) {
    //   this.objPush(new ArcWaveDummy(this, 0, 0, 101, this.bufferCanvas));
    // }
    this.objPush(ground);
    this.objPush(wind);
    // this.objPush(new Drone(this, 0, 0, 20,this.bufferCanvas));

    // this.objPush(new GravityDummy(this, 0, 0, 100, this.bufferCanvas));
    // this.objPush(new MouseDummy(this, 0, 0, 100, this.bufferCanvas));
    // this.objPush(new EarthGravityDummy(this, 0, 0, 101, this.bufferCanvas));
    // this.objPush(new LiquidGravityDummy(this, 0, 0, 101, this.bufferCanvas));


    //wind
    this.windObservable = interval(5000).map(_=>this.createRandomWind());
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


    //object draw
    // this.objs.forEach(it=>{
    //   it.onDraw();
    // });

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //final draw
    context.drawImage(this.bufferCanvas,0,0);


  }

  onStart(data?: any): void {
    super.onStart(data);
    this.objs.forEach(it=>it.onStart());
    this.resizeSubscription = Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event)=>{
      this.onDraw();
    });
  }

  onStop(data?: any): void {
    super.onStop(data);
    this.objs.forEach(it=>it.onStop());
    if(this.resizeSubscription){
      this.resizeSubscription.unsubscribe();
    }

  }

  private createRandomWind(): PointVector {
    // return new PointVector(RandomUtil.random((this.canvas.width / 2) * -1, this.canvas.width / 2), RandomUtil.random((this.canvas.height / 2) * -1, this.canvas.height / 2));
    // return new PointVector(Math.floor(RandomUtil.random(-10, 10)), Math.floor(RandomUtil.random(0, 0)));
    // return this.wind.set(Math.floor(RandomUtil.random((this.canvas.width / 3) * -1, this.canvas.width / 3)));
    return new PointVector(Math.floor(RandomUtil.random((this.canvas.width / 3) * -1, this.canvas.width / 3)));
  }

  public clockSubscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.clock.subscribe(next,error,complete);
  }
  public windSubscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.windObservable.subscribe(next,error,complete);
  }

  // intentSignal(intent: Intent<number>) {
  //   console.log("intent game : "+intent.data);
  //   let newItent = new Intent<GameData>(new GameData());
  //   newItent.data.con = intent.data;
  //   newItent.data.wind = this.wind;
  //   newItent.name = intent.name;
  //   this.objs.forEach(it=>it.intentSignal(newItent))
  // }
}

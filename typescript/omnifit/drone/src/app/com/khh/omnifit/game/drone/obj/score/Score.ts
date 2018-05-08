import {Observable} from 'rxjs/Observable';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {GameData} from '../../vo/GameData';
import {Subscription} from 'rxjs/Subscription';
import {timer} from 'rxjs/observable/timer';
import {DroneStage} from '../../stage/DroneStage';

export class Score extends ObjDrone {

  private beforeIntent: Intent<GameData>;
  private intent: Intent<GameData>;


  private pointObservable: Observable<number>;
  private pointSubscription: Subscription;
  private point: number;
  private timeSecond: number;
  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/drone.png';
    this.pointObservable = timer(1000, 1000); // 1second
  }



  onStart(data?: any) {
    super.onStart();
    this.point = 0;
    this.timeSecond = 60;
    this.pointSubscription = this.pointObservable.subscribe((it)=>{
      this.timeSecond--;
      console.log("timeSecond"+this.timeSecond)
      if(this.timeSecond<=0){
        this.stage.next(this.point);
      }
    })
  }


  onStop(data: any) {
    super.onStop();
    if(this.pointSubscription){
      this.pointSubscription.unsubscribe();
    }
    console.log('Score onStop');
  }


  onDraw(): void {

    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');

    context.setTransform(1, 0, 0, 1, 0, 0);
    if (this.beforeIntent && this.intent){
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.beginPath()
      context.fillStyle = '#FF0000'
      context.font = '30pt Calibri';
      context.textAlign = 'left';
      context.fillText('con(' + this.intent.name + '):' + this.intent.data.con + ' ['+(this.intent.data.con-this.beforeIntent.data.con)+']', 50, 50);
    }
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.beginPath()
      context.fillStyle = '#FF0000'
      context.font = '30pt Calibri';
      context.textAlign = 'right';
      context.fillText('time('+this.timeSecond+') point('+this.point+')', this.canvas.width, 50);


  }


  clockSignal(value?: any) {
    this.onDraw();
  }

  intentSignal(intent: Intent<GameData>) {
    if (!this.beforeIntent){
      this.beforeIntent = intent;
      this.intent = intent;
    }else{
      this.beforeIntent = this.intent;
      this.intent = intent;
    }


    //60초    2초에 한번씩 나오니깐 = 60/2 = 30초
    //9점 만점으로 하면  9*30 = 270점
    this.point += Number(intent.data.con);
  }
}

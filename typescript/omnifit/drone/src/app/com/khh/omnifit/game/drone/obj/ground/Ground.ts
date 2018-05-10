import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../../../../../lib-typescript/com/khh/data/Intent';
import {DroneStage} from '../../stage/DroneStage';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
export class Ground extends ObjDrone{


  private maxX = 50;
  private currentX = 0;
  private beforeWind = 0;
  private wind = 0;
  private resizeSubscription: Subscription;

  constructor(stage: DroneStage, x: number, y: number, z: number, canvas: HTMLCanvasElement) {
    super(stage, x, y, z, canvas);
    this.img = new Image();
    this.img.src = 'assets/image/ground.png';
  }

  onDraw(): void {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    if (this.beforeWind - this.wind > 0){
      this.currentX -= 0.5;
    }else if (this.beforeWind - this.wind < 0){
      this.currentX += 0.5;
    }
    context.drawImage(this.img, (x - this.img.width / 2) + this.currentX, this.canvas.height -  this.img.height);
  }

  // intentSignal(intent: Intent<GameData>) {
  //   if (this.beforeWind != intent.data.wind.x){
  //     this.beforeWind = intent.data.wind.x;
  //   }else{
  //     this.wind = intent.data.wind.x;
  //   }
  // }

  onStart(data?: any) {
    super.onStart(data);
    this.resizeSubscription = Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event) => {
      this.onDraw();
    });
  }

  onStop(data?: any) {
    super.onStop(data);
    if (this.resizeSubscription){
      this.resizeSubscription.unsubscribe();
    }
  }

}

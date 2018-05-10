import {DroneStage} from './DroneStage';
import {Observable, Subscribable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ObjDrone} from '../obj/ObjDrone';
import {isNullOrUndefined} from 'util';
import {DroneStageManager} from '../DroneStageManager';

export class DroneStageEnd extends DroneStage {

  private previousStageData: any | undefined;
  private resizeSubscription: Subscription;
  private mouseDownSubscription: Subscription;

  constructor(canvas: HTMLCanvasElement, objs: Array<ObjDrone> = new Array<ObjDrone>()) {
    super(canvas, objs);
  }

  onDraw(): void {
    console.log('DroneStageEnd onDraw');
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const x = this.canvas.width / 2;
      const y = this.canvas.height / 2;
      context.font = '10pt Calibri';
      context.textAlign = 'center';
      context.fillStyle = 'blue';
      context.fillText('END (' + this.previousStageData + ' 점)', x, y);
      context.fillText('(다시 시작하기)', x, y + 50);
  }


  onStart(data?: any): void {
    this.previousStageData = data;
    this.onDraw();
    this.resizeSubscription = Observable.fromEvent(this.canvas, 'resize').subscribe(_ => this.onDraw());
    this.mouseDownSubscription = Observable.fromEvent(this.canvas, 'mousedown').subscribe((event: MouseEvent) => {
      console.log({x: event.layerX, y: event.layerY});
      console.log('click END: ' + event.offsetX + '/' + event.offsetY);
      DroneStageManager.getInstance().previousStage();
    });
  }


  onStop(data?: any): void {
    super.onStop(data);
    if (isNullOrUndefined(this.resizeSubscription)){this.resizeSubscription.unsubscribe(); }
    if (isNullOrUndefined(this.mouseDownSubscription)){this.mouseDownSubscription.unsubscribe(); }
  }
}

import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../../../../../lib-typescript/com/khh/data/Intent';
import {GameData} from '../../vo/GameData';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
export class Gravity extends ObjDrone{

  private resizeSubscription: Subscription;

  onDraw(): void {
  }
  intentSignal(intent: Intent<GameData>) {
  }


  onStart(data?: any) {
    super.onStart(data);
    this.resizeSubscription = Observable.fromEvent(this.canvas, 'resize').subscribe((event: Event)=>{
      this.onDraw();
    });
  }

  onStop(data?: any) {
    super.onStop(data);
    if(this.resizeSubscription){
      this.resizeSubscription.unsubscribe();
    }
  }
}

import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
// import { Point } from '../org/Point';
export class Gravity extends ObjDrone{
  clockSignal(value?: number) {
  }

  onDraw(): void {
  }
  intentSignal(intent: Intent<number>) {
  }
}

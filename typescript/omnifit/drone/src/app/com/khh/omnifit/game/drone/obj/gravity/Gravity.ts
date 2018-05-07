import { Observable } from 'rxjs/Observable';
import { Point } from '../../../../../graphics/Point';
import { Obj } from '../../../../../obj/Obj';
import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {GameData} from '../../vo/GameData';
// import { Point } from '../org/Point';
export class Gravity extends ObjDrone{
  clockSignal(value?: number) {
  }

  onDraw(): void {
  }
  intentSignal(intent: Intent<GameData>) {
  }
}

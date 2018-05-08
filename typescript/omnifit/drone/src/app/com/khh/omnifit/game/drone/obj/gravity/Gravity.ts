import {ObjDrone} from '../ObjDrone';
import {Intent} from '../../../../../data/Intent';
import {GameData} from '../../vo/GameData';
export class Gravity extends ObjDrone{
  clockSignal(value?: number) {
  }

  onDraw(): void {
  }
  intentSignal(intent: Intent<GameData>) {
  }
}

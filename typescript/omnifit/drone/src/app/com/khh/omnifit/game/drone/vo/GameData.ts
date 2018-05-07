import {Stage} from '../../../../stage/Stage';
import {Observable} from 'rxjs/Observable';
import {PointVector} from '../../../../math/PointVector';

export class GameData {

  private _con: number;
  private _wind: PointVector;


  get con(): number {
    return this._con;
  }

  set con(value: number) {
    this._con = value;
  }


  get wind(): PointVector {
    return this._wind;
  }

  set wind(value: PointVector) {
    this._wind = value;
  }
}
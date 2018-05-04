import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import { interval } from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {isFunction} from 'util';
export class Intent<T> {

  private _name: string;
  private _data: T;
  private _flag: any;


  constructor(data?: T, name?: string,  flag?: any) {
    this._name = name;
    this._data = data;
    this._flag = flag;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }

  get flag(): any {
    return this._flag;
  }

  set flag(value: any) {
    this._flag = value;
  }

}

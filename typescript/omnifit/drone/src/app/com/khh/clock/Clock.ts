import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Obj } from 'app/com/khh/obj/Obj';
import { interval } from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {isFunction} from 'util';
export class Clock {
  private _iterval: number;
  private source: Observable<number>;
  private subscriptions = new Array<Subscription>();
  private subscriptionFncs = new Array;

  constructor(iterval: number) {
    this._iterval = iterval;
    this.init();
  }

  private init() {
    this.source = interval(this._iterval);
  }


  get iterval(): number {
    return this._iterval;
  }
  set iterval(value: number) {
    this._iterval = value;
    this.reset(value);
  }


  public clear(): void{
    this.unsubscribe();
    this.subscriptions.length = 0;
    this.subscriptionFncs.length = 0;
  }

  public unsubscribe(): void{
    while(this.subscriptions.length > 0) {
      this.subscriptions.pop().unsubscribe();
    }
  }

  public signalForce(): void{
    this.subscriptionFncs.forEach((it)=>it(999));
    // this.reset(1);
  }

  private reset(value: number) {
    this.unsubscribe();
    this.source = interval(this.iterval);
    this.subscriptionFncs.forEach((it)=>this.subscribe(it));
  }


  public subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    let subscription = this.source.subscribe(next);
    this.subscriptions.push(subscription);
    this.subscriptionFncs.push(next);
    return subscription;
  }

}

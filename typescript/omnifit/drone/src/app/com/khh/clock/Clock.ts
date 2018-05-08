import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';

export class Clock {

  private _iterval: number;
  private source: Observable<number>;
  private subscriptions: Map<Subscription,any>;

  constructor(iterval: number) {
    this._iterval = iterval;
    this.subscriptions = new Map<Subscription,any>();
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
    this.subscriptions.clear();
  }

  public unsubscribe(): void{
    this.subscriptions.forEach((val, key)=>key.unsubscribe());
  }

  public signalForce(): void{
    this.subscriptions.forEach((it)=>it());
  }
  public delete(s: Subscription): void{
    s.unsubscribe();
    this.subscriptions.delete(s);
    this.reset();

  }

  private reset(value: number = this._iterval) {
    this.unsubscribe();
    this.source = interval(value);
    this.subscriptions.forEach((val, key)=>this.subscribe(val));
  }


  public subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    let subscription = this.source.subscribe(next);
    this.subscriptions.set(subscription,next);
    return subscription;
  }

}

export abstract class Stage {


  // private _refer: Stage;
  // constructor(refer?: Stage) {
  //   this._refer = refer||this;
  // }
  //
  //
  // get refer(): Stage {
  //   return this._refer;
  // }
  //
  // public abstract next(): Stage;
  // public abstract next(name: string): Stage;
  // public abstract previous(): Stage;
  // public abstract previous(name: string): Stage;
  // public abstract data(data: Map<string,any>): void;

  private _data: Map<string,any>;


  get data(): Map<string, any> {
    return this._data;
  }

  set data(value: Map<string, any>) {
    this._data = value;
  }
}

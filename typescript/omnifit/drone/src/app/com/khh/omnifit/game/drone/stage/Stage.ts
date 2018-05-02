export abstract class Stage {

  public abstract next(): Stage;
  public abstract next(name: string): Stage;
  public abstract previous(): Stage;
  public abstract previous(name: string): Stage;
}

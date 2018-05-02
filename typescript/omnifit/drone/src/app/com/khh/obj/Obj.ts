import { Observable } from 'rxjs/Observable';
import { Point } from 'app/com/khh/graphics/Point';
import { Rect } from 'app/com/khh/graphics/Rect';
// import { Point } from '../org/Point';
export abstract class Obj extends Rect{
  head: Point;
}

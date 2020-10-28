import {Point} from "@src/domain/Point";
import {PointVector} from "@src/domain/PointVector";

export class Rectangle {
    public start: Point;
    public end: Point;
    constructor(_start: Point, _end?: Point) {
        if(!_end) {
            _end = _start;
        }
        this.start = _start;
        this.end = _end;
    }

    get center(): Point {
        return new Point(
            this.start.x + ((this.end.x - this.start.x) / 2),
            this.start.y + ((this.end.y - this.start.y) / 2),
            this.start.z + ((this.end.z - this.start.z) / 2)
        );
    }
    get centerVector(): PointVector {
        return new PointVector(
            this.start.x + ((this.end.x - this.start.x) / 2),
            this.start.y + ((this.end.y - this.start.y) / 2),
            this.start.z + ((this.end.z - this.start.z) / 2)
        );
    }
}

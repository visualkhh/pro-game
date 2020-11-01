import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {PointVector} from "@src/domain/PointVector";
// import {fromEvent} from "rxjs";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');

export abstract class Obj extends PointVector  {

    public mass = 0;
    public age = 0;
    public id?: string;
    // constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, public avaliablePlace: Rectangle = new Rectangle(new Point(0, 0), new Point(0, 0))) {
    //     super(canvas, context);
    // }


    // get centerPoint(): Point {
    //     return new Point();
    // }
}

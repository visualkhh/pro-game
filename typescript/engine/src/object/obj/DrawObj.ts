import {Drawable} from "@src/draw/Drawable";
import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {PointVector} from "@src/domain/PointVector";
import {Obj} from "@src/object/obj/Obj";
import {Draw} from "@src/draw/Draw";
// import {fromEvent} from "rxjs";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');

export abstract class DrawObj extends Obj implements Drawable {
    abstract draw(draw: Draw): void ;

    // constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, public avaliablePlace: Rectangle = new Rectangle(new Point(0, 0), new Point(0, 0))) {
    //     super(canvas, context);
    // }


    // get centerPoint(): Point {
    //     return new Point();
    // }
}

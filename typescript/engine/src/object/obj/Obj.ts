import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {PointVector} from "@src/domain/PointVector";
// import {fromEvent} from "rxjs";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');

export abstract class Obj extends PointVector  {

    public mass = 0; // 질량
    public e = 0; // 탄성
    public age = 0; // 생성된 시간 가중치
    public id?: string;
    // constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, public avaliablePlace: Rectangle = new Rectangle(new Point(0, 0), new Point(0, 0))) {
    //     super(canvas, context);
    // }


    // get centerPoint(): Point {
    //     return new Point();
    // }
}

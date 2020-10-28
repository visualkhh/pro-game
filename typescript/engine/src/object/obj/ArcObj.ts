import {Draw} from "@src/draw/Draw";
import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {Obj} from "@src/object/obj/Obj";
// import {engine} from "@src/index";
import {MathUtil} from "@src/math/MathUtil";
import {Optional} from "@src/optional/Optional";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
import {config} from "@src/config";

export class ArcObj extends Obj {

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, avaliablePlace: Rectangle = new Rectangle(new Point(0, 0), new Point(0, 0))) {
        super(canvas, context, avaliablePlace);
    }

    draw() {
        // console.log(center.x, center.y);
        const sizeGorup = this.canvas.width / 100;
        let center = this.avaliablePlace.center;
        this.context.beginPath();
        this.context.fillStyle = this.fillStyle;
        this.context.strokeStyle = this.strokeStyle;
        this.context.arc(
            MathUtil.getValueByTotInPercent(this.canvas.width, center.x),
            MathUtil.getValueByTotInPercent(this.canvas.height, center.y),
            sizeGorup * Optional.ofNullable(this.mass).orElse(0), 0, 2 * Math.PI
        );
        this.context.fill();
        this.context.stroke()
        // const splitSize = 100;
        // let wUnit = splitSize;
        // let hUnit = splitSize;
        // this.context.strokeStyle = '#373737';
        // this.context.lineWidth = 0.5;
        // this.context.setLineDash([4, 2]);
        // for (let i = 0; wUnit * i <= this.canvas.width; i++) {
        //     this.context.beginPath();
        //     this.context.moveTo(wUnit * i, 0);
        //     this.context.lineTo(wUnit * i, this.canvas.height);
        //     this.context.stroke();
        // }
        // for (let i = 0; hUnit * i <= this.canvas.height; i++) {
        //     this.context.beginPath();
        //     this.context.moveTo(0, hUnit * i);
        //     this.context.lineTo(this.canvas.width, hUnit * i);
        //     this.context.stroke();
        // }
    }
}

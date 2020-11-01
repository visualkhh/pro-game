import {Draw} from "@src/draw/Draw";
import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {Obj} from "@src/object/obj/Obj";
// import {engine} from "@src/index";
import {MathUtil} from "@src/math/MathUtil";
import {Optional} from "@src/optional/Optional";

const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
import {config} from "@src/config";
import {DrawObj} from "@src/object/obj/DrawObj";
import {PointVector} from "@src/domain/PointVector";
import {RandomUtil} from "@src/random/RandomUtil";

export class ArcDrawObj extends DrawObj {

    constructor(public percentPoint: PointVector, public mass = RandomUtil.scope(1, 10), public fillStyle = '#000000', public strokeStyle = '#000000' ) {
        super();
    }

    draw(draw: Draw): void {
        // console.log(center.x, center.y);
        const sizeGorup = draw.canvas.width / 100;
        let center = this.percentPoint;
        draw.context.beginPath();
        draw.context.fillStyle = this.fillStyle;
        draw.context.strokeStyle = this.strokeStyle;
        draw.context.arc(
            MathUtil.getValueByTotInPercent(draw.canvas.width, center.x),
            MathUtil.getValueByTotInPercent(draw.canvas.height, center.y),
            sizeGorup * Optional.ofNullable(this.mass).orElse(0), 0, 2 * Math.PI
        );
        draw.context.fill();
        draw.context.stroke()
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

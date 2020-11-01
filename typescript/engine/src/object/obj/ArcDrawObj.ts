import {Draw} from "@src/draw/Draw";
import {Rectangle} from "@src/domain/Rectangle";
import {Point} from "@src/domain/Point";
import {Obj} from "@src/object/obj/Obj";
import {engine} from "@src/index";
import {MathUtil} from "@src/math/MathUtil";
import {Optional} from "@src/optional/Optional";

const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
import {config} from "@src/config";
import {DrawObj} from "@src/object/obj/DrawObj";
import {PointVector} from "@src/domain/PointVector";
import {RandomUtil} from "@src/random/RandomUtil";

export class ArcDrawObj extends DrawObj {

    constructor(public id: string, public mass = RandomUtil.scope(1, 10), public fillStyle = '#000000', public strokeStyle = '#000000') {
        super();
    }

    draw(draw: Draw): void {
        this.processing();
        // console.log(center.x, center.y);
        const sizeGorup = draw.canvas.width / 100;
        draw.context.beginPath();
        draw.context.fillStyle = this.fillStyle;
        draw.context.strokeStyle = this.strokeStyle;
        draw.context.arc(
            MathUtil.getValueByTotInPercent(draw.canvas.width, this.x),
            MathUtil.getValueByTotInPercent(draw.canvas.height, this.y),
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

    //https://evan-moon.github.io/2017/05/06/gravity-via-js-1/
    private processing() {
        // this.add(0, 0.1);






        let excludeObjs = engine.getExcludeObjs(this.id);
        console.log(this.id, excludeObjs);
        let move = this.get();
        excludeObjs.forEach((v) => {
            //////
            let dist = this.dist(v);
            // let gap = yGap;//xGap;//Math.max(yGap, xGap);
            // let gug = (yGap / xGap);
            // let gug = Math.max(yGap, xGap);
            // console.log(xGap, yGap, gug, mGap);
            // console.log(yGap / xGap);
            // let startX = MathUtil.getValueByTotInPercent(this.canvas.width, this.avaliablePlace.start.x);
            // let startY = MathUtil.getValueByTotInPercent(this.canvas.height, this.avaliablePlace.start.y);
            // let endX = MathUtil.getValueByTotInPercent(this.canvas.width, this.avaliablePlace.end.x);
            // let endY = MathUtil.getValueByTotInPercent(this.canvas.height, this.avaliablePlace.end.y);
            // let yGap = Math.abs(endY - startY);
            // let xGap = Math.abs(endX - startX);
            // let mGap = Math.sqrt(Math.pow(yGap, 2) + Math.pow(xGap, 2));
            // this.context.fillText(mGap.toFixed(3), startX + (xGap / 2),  startY + ((yGap) / 2));
            // this.context.fillText(mGap.toFixed(3), startX + (xGap / 2),  startY + ((yGap) / 2));

            // this.infos.set("t", new TriangleObj(this.canvas, this.context, new Rectangle(center, centerSub)));
            //////
            let mass = config.G * this.mass * v.mass;
            // 2:5 = 10:□ 에서 2 × □ = 5 × 10 이므로 □ =25이기 때문입니다.
            // 1:gug = xgap: □
            // 1 * □ = gug * xgap
            // let vv = gug * mGap;
            // let xx = gug * mGap;
            let r2 = Math.pow(dist, 2);
            // let rx = Math.pow(dist, 2);
            // let ry = Math.pow(dist, 2);

            let mx = r2 ? mass / r2 : 0;
            let my = r2 ? mass / r2 : 0;
            // mx *= (vv * 1);
            // my *= (xx * 1);
            // console.log(mGap, mx, my, vv,xx);
            // move.add(mx, my)
            if (this.x > v.x) {
                move.x -= mx;
            } else {
                move.x += mx;
            }
            if (this.y > v.y) {
                move.y -= my;
            } else {
                move.y += my;
            }
            // console.log(move, mass, mx, my);
        });

        this.set(move);


        // this.objs.forEach((v, k, m) => {
        //     // if("arcObj0" != k) {
        //     //     return;
        //     // }
        //     let center = v.percentPoint;
        //     // let centerVector = new PointVector(center.x, center.y, center.z);
        //     let move = v.percentPoint;
        //     // let moveVector = new PointVector(move.x, move.y, move.z);
        //
        //
        //     //2:5 = 10:□ 에서 2 × □ = 5 × 10 이므로 □ =25이기 때문입니다.
        //     this.objs.forEach((vSub, kSub, mSub) => {
        //         if(k != kSub) {
        //
        //             let centerSub = vSub.percentPoint;
        //             //////
        //             let startX = center.x;
        //             let startY = center.y;
        //             let endX = centerSub.x;
        //             let endY = centerSub.y;
        //             // let yGap = startY - endY;
        //             // let xGap = startX - endX;
        //             let yGap = Math.abs(endY - startY);
        //             let xGap = Math.abs(endX - startX);
        //             // let gap = yGap;//xGap;//Math.max(yGap, xGap);
        //             // let gug = (yGap / xGap);
        //             let gug = Math.max(yGap,xGap);
        //             let mGap = Math.sqrt(Math.pow(yGap, 2) + Math.pow(xGap, 2));
        //             console.log(xGap, yGap, gug, mGap)
        //             // console.log(yGap / xGap);
        //             // let startX = MathUtil.getValueByTotInPercent(this.canvas.width, this.avaliablePlace.start.x);
        //             // let startY = MathUtil.getValueByTotInPercent(this.canvas.height, this.avaliablePlace.start.y);
        //             // let endX = MathUtil.getValueByTotInPercent(this.canvas.width, this.avaliablePlace.end.x);
        //             // let endY = MathUtil.getValueByTotInPercent(this.canvas.height, this.avaliablePlace.end.y);
        //             // let yGap = Math.abs(endY - startY);
        //             // let xGap = Math.abs(endX - startX);
        //             // let mGap = Math.sqrt(Math.pow(yGap, 2) + Math.pow(xGap, 2));
        //             // this.context.fillText(mGap.toFixed(3), startX + (xGap / 2),  startY + ((yGap) / 2));
        //             // this.context.fillText(mGap.toFixed(3), startX + (xGap / 2),  startY + ((yGap) / 2));
        //
        //             // this.infos.set("t", new TriangleObj(this.canvas, this.context, new Rectangle(center, centerSub)));
        //             //////
        //             let mass = config.G * Optional.ofNullable(v.mass).orElse(0) * Optional.ofNullable(vSub.mass).orElse(0);
        //             // 2:5 = 10:□ 에서 2 × □ = 5 × 10 이므로 □ =25이기 때문입니다.
        //             // 1:gug = xgap: □
        //             // 1 * □ = gug * xgap
        //             let vv = gug * xGap;
        //             let xx = gug * yGap;
        //             let rx = Math.pow(mGap, 2);
        //             let ry = Math.pow(mGap, 2);
        //
        //             let mx = rx ? mass / rx : 0;
        //             let my = ry ? mass / ry : 0;
        //             mx *=  (vv*1);
        //             my *=  (xx*1);
        //             // console.log(mGap, mx, my, vv,xx);
        //             if(center.x > centerSub.x) {
        //                 move.x -= mx;
        //             } else {
        //                 move.x += mx;
        //             }
        //             if(center.y > centerSub.y) {
        //                 move.y -= my;
        //             } else {
        //                 move.y += my;
        //             }
        //             // console.log(move, mass, mx, my);
        //         }
        //     });
        //     // if(move.x > 100){
        //     //     move.x = 0; //RandomUtil.random(0, 100);
        //     // }
        //     // if(move.y > 100){
        //     //     move.y =  0; //RandomUtil.random(0, 100);
        //     // }
        //     // if(move.x < 0){
        //     //     move.x =  100; //RandomUtil.random(0, 100);
        //     // }
        //     // if(move.y < 0){
        //     //     move.y =  100; //RandomUtil.random(0, 100);
        //     // }
        //     // console.log(move.x, move.y);
        //     // console.log('-----------')
        //     p.set(k, move);
        //
        // });
        //
        //
        // p.forEach((v, k, m) => {
        //     this.objs.get(k)!.percentPoint = v;
        // });



        if (this.x > 100) {
            this.x = 0;
        }
        if (this.y > 100) {
            this.y = 0;
        }
        if (this.x < 0) {
            this.x = 100;
        }
        if (this.y < 0) {
            this.y = 100;
        }
    }


}

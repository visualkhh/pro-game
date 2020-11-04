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

    // private shadow = new Array<PointVector>();
    public acceleration = new PointVector(RandomUtil.scope(-1, 1) / 10, RandomUtil.scope(-1, 1) / 10);
    // private velocity = new PointVector(0, 0);
    // private acceleration = new PointVector(0, 0);
    constructor(public id: string, public mass = RandomUtil.scope(1, 10), public fillStyle = '#000000', public strokeStyle = '#000000') {
        super();
        this.e = RandomUtil.scope(5,20);
    }

    draw(draw: Draw): void {
        // console.log(this.id, this.acceleration);
        this.processing(draw);
        this.checkEdge(draw);

        // console.log(center.x, center.y);
        // const sizeGorup = draw.canvas.width / 100;
        draw.context.beginPath();
        draw.context.fillStyle = this.fillStyle;
        draw.context.strokeStyle = this.strokeStyle;
        let xPixel = MathUtil.getValueByTotInPercent(draw.canvas.width, this.x);
        let yPixel = MathUtil.getValueByTotInPercent(draw.canvas.height, this.y);
        let radiusPixel = MathUtil.getValueByTotInPercent(draw.canvas.width, this.mass);
        // console.log('--->', xPixel, yPixel, radiusPixel);
        draw.context.arc(
            xPixel,
            yPixel,
            radiusPixel, 0, 2 * Math.PI
        );
        draw.context.fill();
        draw.context.stroke()

        // this.shadow.forEach(it => {
        //     draw.context.beginPath();
        //     draw.context.fillStyle = "#000000";
        //     draw.context.arc(
        //         MathUtil.getValueByTotInPercent(draw.canvas.width, it.x),
        //         MathUtil.getValueByTotInPercent(draw.canvas.height, it.y),
        //         3, 0, 2 * Math.PI
        //     );
        //     // draw.context.fill();
        //     draw.context.stroke();
        //     draw.context.beginPath();
        // });
        // this.shadow.push(this.get());
    }

    //https://evan-moon.github.io/2017/05/06/gravity-via-js-1/
    // 기울기: https://ko.khanacademy.org/math/cc-eighth-grade-math/cc-8th-linear-equations-functions/8th-slope/a/slope-formula
    // 알짜힘, 여러힘작용: https://ko.khanacademy.org/partner-content/pixar/effects/particle-physics/v/fx8-fine
    // 힘과 가속도 f=ma: https://ko.khanacademy.org/partner-content/pixar/effects/particle-physics/v/fx9-finalcut
    // 입자 충돌: https://ko.khanacademy.org/partner-content/pixar/effects/particle-physics/v/fx-collision
    // 부드러운 충돌: https://ko.khanacademy.org/partner-content/pixar/effects/particle/v/fx3-finalcut2
    // 충돌 체크: https://evan-moon.github.io/2017/05/06/gravity-via-js-2/
    private processing(draw: Draw) {
        // this.acceleration.div(5.5);
        // this.add(this.acceleration);

        // if(this.id != "arcObj2") {
        //     return;
        // }


        let excludeObjs = engine.getExcludeObjs(this.id);
        // console.log(this.id, excludeObjs);
        let move = new PointVector(); //this.get();
        excludeObjs.forEach((v) => {
            //////
            let sub = PointVector.sub(v, this);
            // let slope = pointVector.y ? pointVector.x / pointVector.y : 0;
            // const dir = PointVector.sub(v, this);
            // sub.normalize();
            // sub.mult(0.5);
            // this.acceleration = dir;
            // this.velocity.add(this.acceleration);
            // this.velocity.limit(0.1);
            // move.add(this.velocity);
            // sub.normalize();
            // sub.mult(0.5);
            let dist = PointVector.dist(this, v);
            // console.log(this.id, "dist:", dist, "xSlope:", xSlope);
            // console.log(this.id, "dist:", dist);
            // return;
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
            // mx *= (sub.x / dist) * 0.1;
            // my *= (sub.y / dist) * 0.1;
            // let number = sub.x / dist;
            mx *= (sub.x / dist) * 0.1;
            my *= (sub.y / dist) * 0.1;
            // console.log(sub, mx, my);
            move.add(mx, my)
            // if (this.x > v.x) {
            //     move.x -= mx;
            // } else {
            //     move.x += mx;
            // }
            // if (this.y > v.y) {
            //     move.y -= my;
            // } else {
            //     move.y += my;
            // }
            // console.log(move, mass, mx, my);
        });

        // move.limit(1);
        this.acceleration.add(move);
        // let dist = PointVector.dist(this, move);
        this.acceleration.limit(1);


        //충돌
        excludeObjs.forEach(it => {
            let dist = this.dist(it);
            let radiusForm = this.mass;
            let radiusTo = it.mass;
            let radiusSum = radiusForm + radiusTo;
            //console.log(dist, radiusSum, radiusForm, radiusTo);
            if (dist <= radiusSum) {
                if(this.x > it.x) {

                } else if (this.y > it.y) {

                }
                this.acceleration.mult(-1);
                this.acceleration.mult(this.e);
                return;
            }
        });

        this.add(this.acceleration);
        // this.mult(dist);
        // move.mult(0.05);
        // let pointVector = PointVector.div(this.directionvelocity, dist);
        // pointVector.mult(0.05);
        // this.add(pointVector);





        const size = 1;
        excludeObjs.filter(it =>
            (this.x - size) <= it.x && (this.x + size) >= it.x &&
            (this.y - size) <= it.y && (this.y + size) >= it.y
            //&& this.mass >= it.mass
        ).forEach(it => {
            // engine.deleteObj(it.id);
            // this.mass += it.mass;

            // const point = new PointVector(RandomUtil.scope(0, 100), RandomUtil.scope(0, 100));
            // const arcObj = new ArcDrawObj(it.id!).set(point);
            // arcObj.fillStyle = RandomUtil.rgb();
            // arcObj.mass = RandomUtil.scope(1, 10);
            // engine.setObj(arcObj);
        });


    }


    private checkEdge(draw: Draw) {
        if (this.x > 100) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = 100;
        }

        if (this.y > 100) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = 100;
        }
    }
}

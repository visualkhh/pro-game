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
import {ConvertUtil} from "@src/convert/ConvertUtil";

export class ArcDrawObj extends DrawObj {

    public stop = false;
    public shadowDraw = false;
    private shadow = new Array<PointVector>();
    public acceleration = new PointVector(RandomUtil.scope(-1, 1) / 10, RandomUtil.scope(-1, 1) / 10);
    // private velocity = new PointVector(0, 0);
    // private acceleration = new PointVector(0, 0);
    constructor(public id: string, public mass = RandomUtil.scope(1, 10), public fillStyle = '#000000', public strokeStyle = '#000000') {
        super();
        this.e = RandomUtil.scope(1,4);
    }

    draw(draw: Draw): void {
        // console.log(this.id, this.acceleration);
        if(!this.stop)
        this.processing(draw);
        this.checkEdge(draw);

        // console.log(center.x, center.y);
        // const sizeGorup = draw.canvas.width / 100;
        draw.context.beginPath();
        draw.context.fillStyle = this.fillStyle;
        draw.context.strokeStyle = this.strokeStyle;
        let xPixel = MathUtil.getValueByTotInPercent(draw.canvas.width, this.x);
        let yPixel = MathUtil.getValueByTotInPercent(draw.canvas.height, this.y);
        let radiusPixel = MathUtil.getValueByTotInPercent(draw.canvas.width, Math.min(this.z,10));
        radiusPixel = radiusPixel < 0 ? 0 : radiusPixel;
        // console.log('--->', xPixel, yPixel, radiusPixel);
        draw.context.arc(
            xPixel,
            yPixel,
            radiusPixel, 0, 2 * Math.PI
        );
        draw.context.fill();
        draw.context.stroke();
        draw.context.closePath();

        if(!this.shadowDraw)
            return;
        this.shadow.forEach(it => {
            // draw.context.moveTo(pointVector.x, pointVector.y);
            // pointVector.sub(this.acceleration);
            // draw.context.lineTo(MathUtil.getValueByTotInPercent(draw.canvas.width,it.x), MathUtil.getValueByTotInPercent(draw.canvas.height,it.y));
            draw.context.beginPath();
            /* 비례식
                2:5 = 10:□ 에서 2 × □ = 5 × 10 이므로 □ =25이기 때문입니다.
                100:255 = z: □
                100 * □ = 255 * z
             */
            // let num = (255 * it.z) / 10;
            // num = num - 255;
            // let number = ConvertUtil.decimalToHexString(num);
            // let fillStyle1 = "#"+number+number+number;
            // console.log('fillStyle1', num);
            // draw.context.fillStyle = 'rgba(0,0,0,'+num+')';
            // draw.context.strokeStyle = 'rgba(0,0,0,'+num+')';
            // draw.context.strokeStyle = 'rgba(0,0,0, '+num+')';
            draw.context.arc(
                MathUtil.getValueByTotInPercent(draw.canvas.width, it.x),
                MathUtil.getValueByTotInPercent(draw.canvas.height, it.y),
                2, 0, 2 * Math.PI
            );
            // // draw.context.fill();
            // draw.context.beginPath();
            draw.context.stroke();
            draw.context.closePath();
        });
        this.shadow.push(this.get());
    }

    // https://evan-moon.github.io/2017/05/06/gravity-via-js-1/
    // 기울기: https://ko.khanacademy.org/math/cc-eighth-grade-math/cc-8th-linear-equations-functions/8th-slope/a/slope-formula
    // 알짜힘, 여러힘작용: https://ko.khanacademy.org/partner-content/pixar/effects/particle-physics/v/fx8-fine
    // 힘과 가속도 f=ma: https://ko.khanacademy.org/partner-content/pixar/effects/particle-physics/v/fx9-finalcut
    // 힘 중력: https://ko.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/air-and-fluid-resistance
    // 입자 충돌: https://ko.khanacademy.org/partner-content/pixar/effects/particle-physics/v/fx-collision
    // 부드러운 충돌: https://ko.khanacademy.org/partner-content/pixar/effects/particle/v/fx3-finalcut2
    // 충돌 체크: https://evan-moon.github.io/2017/05/06/gravity-via-js-2/
    // 입자 시스템의 물리학: https://ko.khanacademy.org/partner-content/pixar/effects?ref=resume_learning
    private processing(draw: Draw) {
        // this.acceleration.div(5.5);
        // this.add(this.acceleration);

        // if(this.id != "arcObj2") {
        //     return;
        // }

        this.add(this.acceleration);

        let excludeObjs = engine.getExcludeObjs(this.id);
        // console.log(this.id, excludeObjs);
        let move = new PointVector(); //this.get();
        let targetPoint = this.get();
        excludeObjs.forEach((it) => {
            let other = it as ArcDrawObj;
            // 차이 좌표
            let sub = PointVector.sub(other, this);
            let dist = PointVector.dist(other, this);
            // this.infos.set("t", new TriangleObj(this.canvas, this.context, new Rectangle(center, centerSub)));
            /* 만유인력법칙
                F : 두 점질량 간의 중력의 크기
                G : 중력 상수,
                m1 : 첫 번째 점질량의 질량
                m2 : 두 번째 점질량의 질량
                r : 두 점질량의 거리
                F = G  m1*m2/ r^2
             */
            /* 비례식
                2:5 = 10:□ 에서 2 × □ = 5 × 10 이므로 □ =25이기 때문입니다.
                1:gug = xgap: □
                1 * □ = gug * xgap
             */
            let m1 = this.mass;
            let m2 = other.mass;
            let r2 = Math.pow(dist, 2);
            let mass = m1 * m2;
            let gravitation_v = r2 ? mass / r2 : 0;
            let gravitation = new PointVector().set(gravitation_v, gravitation_v, gravitation_v).mult(config.G);

            gravitation.mult(new PointVector((sub.x / dist), (sub.y / dist), (sub.z / dist)));
            gravitation.limit(1);
            targetPoint.add(gravitation);

            dist = targetPoint.dist(other);
            let radiusForm = this.volume;
            let radiusTo = other.volume;
            let radiusSum = radiusForm + radiusTo;
            // 충돌
            if (dist <= radiusSum) {
                targetPoint.sub(gravitation.mult(this.e));
            }
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

        // targetPoint.limit(1);
        // this.acceleration.add(move);
        // this.acceleration.add( PointVector.sub(targetPoint, this) );


        //충돌
        // excludeObjs.forEach(it => {
        //     let it1 = it as ArcDrawObj;
        //     let dist = this.dist(it);
        //     let asub = PointVector.sub(this.acceleration, it1.acceleration);
        //     let radiusForm = this.volume;
        //     let radiusTo = it.volume;
        //     let radiusSum = radiusForm + radiusTo;
        //     //console.log(dist, radiusSum, radiusForm, radiusTo);
        //     if (dist <= radiusSum) {
        //         alert(1);
        //         // asub.mult(-1);
        //         // asub.normalize();
        //         // this.acceleration.mult(asub);
        //         this.acceleration.mult(-1);
        //         // if(Math.abs(this.acceleration.x) > Math.abs(this.acceleration.y)) {
        //         //     this.acceleration.x *= -1;
        //         // } else {
        //         //     this.acceleration.y *= -1;
        //         // }
        //         this.acceleration.add(it1.acceleration);
        //         this.acceleration.mult(this.e);//.mult(RandomUtil.scope(1, 3));
        //         return;
        //     }
        // });


        const targetAcceleration = PointVector.sub(targetPoint, this);
        targetAcceleration.limit(5);
        if(targetAcceleration.x || targetAcceleration.y  || targetAcceleration.z) {
            this.acceleration = targetAcceleration;
        }
        this.set(targetPoint);

        // this.mult(dist);
        // move.mult(0.05);
        // let pointVector = PointVector.div(this.directionvelocity, dist);
        // pointVector.mult(0.05);
        // this.add(pointVector);




    }


    private checkEdge(draw: Draw) {
        if (this.x > 100) {
            this.x = 100;
            this.acceleration.x *= -1;
            // this.x = this.edgeLoop ? 0 : 100;
        } else if (this.x < 0) {
            this.x = 0;
            this.acceleration.x *= -1;
            // this.x = this.edgeLoop ? 100 : 0;
        }

        if (this.y > 100) {
            this.y = 100;
            this.acceleration.y *= -1;
        } else if (this.y < 0) {
            this.y = 0;
            this.acceleration.y *= -1;
        }
    }
}

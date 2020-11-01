import {Drawable} from "@src/draw/Drawable";
import {SizeGrid} from "@src/object/grid/grid/SizeGrid";
import {Obj} from "@src/object/obj/Obj";
import {ArcDrawObj} from "@src/object/obj/ArcDrawObj";
import {Point} from "@src/domain/Point";
import {Rectangle} from "@src/domain/Rectangle";
import {Unit} from "@src/domain/Unit";
import {MathUtil} from "@src/math/MathUtil";
import {RandomUtil} from "@src/random/RandomUtil";
import {Optional} from "@src/optional/Optional";
import {config} from "@src/config";
// import {TriangleObj} from "@src/object/obj/TriangleObj";
import {DrawObj} from "@src/object/obj/DrawObj";
import {Draw} from "@src/draw/Draw";
import {PointVector} from "@src/domain/PointVector";

const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
const {map, filter, catchError} = require('rxjs/operators');

class Engine implements Drawable {

    public grid: SizeGrid;
    public objs = new Map<string, ArcDrawObj>();
    public infos = new Map<string, DrawObj>();


    constructor(public canvas: HTMLCanvasElement, public context: CanvasRenderingContext2D) {
        this.setCanvasSize(window);
        this.grid = new SizeGrid(50);
        this.addEvent();
        this.animationFrame();
        this.initObj();
    }

    animationFrame(timestamp?: number): void {
        // console.log("---", timestamp)
        this.draw(new Draw(this.canvas, this.context));
        if(config.drawDelay) {
            timer(config.drawDelay).subscribe((cnt: number) => window.requestAnimationFrame(this.animationFrame.bind(this)))
        } else {
            window.requestAnimationFrame(this.animationFrame.bind(this));
        }
    }

    draw(draw: Draw): void {
        // 픽셀 정리
        this.context.restore();
        this.context.setLineDash([]);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.context.save();
        this.context.beginPath();

        this.processing();
        this.context.save();
        this.grid.draw(draw);
        this.context.restore();

        this.objs.forEach(it => {
            this.context.save();
            it.draw(draw);
            this.context.restore();
        });
        this.infos.forEach(it => {
            this.context.save();
            it.draw(draw);
            this.context.restore();
        });
        // console.log("---", timestamp)
    }

    private setCanvasSize(window: Window) {
        canvas.width = Math.min(window.innerWidth, window.innerHeight);
        canvas.height = canvas.width;
    }
    private addEvent() {
        fromEvent(window, 'resize').subscribe((event: Event) => {
            let target  = event.target! as Window;
            this.setCanvasSize(target);
        });

        fromEvent(canvas, 'click').subscribe((event: MouseEvent) => {

            const point = new PointVector(
                MathUtil.getPercentByTot(canvas.width, event.clientX),
                MathUtil.getPercentByTot(canvas.height, event.clientY)
            );
            // point.unit = Unit.PERCENT;
            const arcObj = new ArcDrawObj(point);
            arcObj.fillStyle = RandomUtil.rgb();
            arcObj.mass = RandomUtil.scope(1, 10);
            this.objs.set(this.createId('Obj'), arcObj);
        });
    }



    public createId(prefix: string) {
        // return prefix + '-' + new Date().getTime() + '-' + RandomUtil.getRandomAlphabet(10);
        return prefix + '-' +  RandomUtil.alphabet(10);
    }

    //https://evan-moon.github.io/2017/05/06/gravity-via-js-1/
    private processing() {
        // this.infos.clear();
        // // return;
        // const p = new Map<string, PointVector>();
        // // for (let [key, value] of this.objs) {
        // //     console.log(key, value);
        // // }
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
    }

    private initObj() {
        let mass = 5;
        // let arcObj0 = new ArcObj(canvas, this.context, new Rectangle(new Point(50, 0)));
        let arcObj0 = new ArcDrawObj(new PointVector(0, 50));
        arcObj0.fillStyle = RandomUtil.rgb();
        arcObj0.mass = mass; //RandomUtil.scope(5, 15);
        this.objs.set("arcObj0", arcObj0);
        //
        //
        // let arcObj1 = new ArcObj(canvas, this.context, new Rectangle(new Point(100, 50)));
        // let arcObj1 = new ArcObj(canvas, this.context, new Rectangle(new Point(50, 0)));
        let arcObj1 = new ArcDrawObj(new PointVector(50, 50));
        arcObj1.fillStyle = RandomUtil.rgb();
        arcObj1.mass = mass; // RandomUtil.scope(5, 15);
        this.objs.set("arcObj1", arcObj1);


        // let arcObj2 = new ArcObj(canvas, this.context, new Rectangle(new Point(100, 50)));
        // arcObj2.fillStyle = RandomUtil.rgb();
        // arcObj2.mass = mass; //RandomUtil.scope(5, 15);
        // this.objs.set("arcObj2", arcObj2);

        // let arcObj3 = new ArcObj(canvas, this.context, new Rectangle(new Point(50, 100)));
        // arcObj3.fillStyle = RandomUtil.rgb();
        // this.objs.set("arcObj3", arcObj3);
    }
}


const canvasContainer = document.querySelector("#canvasContainer")! as HTMLDivElement;
const canvas: HTMLCanvasElement = document.createElement("canvas");
canvasContainer.appendChild(canvas);
const engine = new Engine(canvas, canvas.getContext('2d')!);
engine.animationFrame();

export {engine};

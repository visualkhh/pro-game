import {Draw} from "@src/draw/Draw";
import {SizeGrid} from "@src/object/grid/grid/SizeGrid";
import {Obj} from "@src/object/obj/Obj";
import {ArcObj} from "@src/object/obj/ArcObj";
import {Point} from "@src/domain/Point";
import {Rectangle} from "@src/domain/Rectangle";
import {Unit} from "@src/domain/Unit";
import {MathUtil} from "@src/math/MathUtil";
import {RandomUtil} from "@src/random/RandomUtil";
import {Optional} from "@src/optional/Optional";
import {PointVector} from "@src/domain/PointVector";

const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
const {map, filter, catchError} = require('rxjs/operators');

class Engine extends Draw {

    public grid: SizeGrid;
    public objs = new Map<string, Obj>();


    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.setCanvasSize(window);
        this.grid = new SizeGrid(canvas, this.context, 50);
        this.addEvent();
        this.animationFrame();
        this.initObj();
    }

    animationFrame(timestamp?: number): void {
        // console.log("---", timestamp)
        this.draw();
        window.requestAnimationFrame(this.animationFrame.bind(this));
    }

    draw(): void {
        // 픽셀 정리
        this.context.restore();
        this.context.setLineDash([]);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.context.save();
        this.context.beginPath();

        this.processing();
        this.context.save();
        this.grid.draw();
        this.context.restore();

        this.objs.forEach(it => {
            this.context.save();
            it.draw();
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

            const point = new Point(
                MathUtil.getPercentByTot(canvas.width, event.clientX),
                MathUtil.getPercentByTot(canvas.height, event.clientY)
            );
            // point.unit = Unit.PERCENT;
            const arcObj = new ArcObj(canvas, this.context, new Rectangle(point));
            arcObj.fillStyle = RandomUtil.getRandomRGBColor();
            arcObj.mass = RandomUtil.random(1, 10);
            this.objs.set(this.createId('Obj'), arcObj);
        });
    }



    public createId(prefix: string) {
        // return prefix + '-' + new Date().getTime() + '-' + RandomUtil.getRandomAlphabet(10);
        return prefix + '-' +  RandomUtil.getRandomAlphabet(10);
    }

    //https://evan-moon.github.io/2017/05/06/gravity-via-js-1/
    private processing() {
        const p = new Map<string, Point>();
        this.objs.forEach((v, k, m) => {
            let center = v.avaliablePlace.center;
            // let centerVector = new PointVector(center.x, center.y, center.z);
            let move = v.avaliablePlace.center;
            // let moveVector = new PointVector(move.x, move.y, move.z);
            this.objs.forEach((vSub, kSub, mSub) => {
                if(k != kSub) {
                    let centerSub = vSub.avaliablePlace.center;
                    let mass = 6.674 * Optional.ofNullable(v.mass).orElse(0) * Optional.ofNullable(vSub.mass).orElse(0);
                    let x = Math.pow(center.x - centerSub.x, 2);
                    let y = Math.pow(center.y - centerSub.y, 2);
                    let mx = x != 0 ? mass / x : 0;
                    let my = y != 0 ? mass / y : 0;
                    console.log(move, x, y, mx, my);
                    // mx *= 6.674;
                    // my *= 6.674;
                    if(center.x > centerSub.x) {
                        move.x -= mx;
                    } else {
                        move.x += mx;
                    }
                    if(center.y > centerSub.y) {
                        move.y -= my;
                    } else {
                        move.y += my;
                    }
                }
            });
            // if(move.x > 100){
            //     move.x = RandomUtil.random(0, 100);
            // }
            // if(move.y > 100){
            //     move.y =  RandomUtil.random(0, 100);
            // }
            // if(move.x < 0){
            //     move.x =  RandomUtil.random(0, 100);
            // }
            // if(move.y < 0){
            //     move.y =  RandomUtil.random(0, 100);
            // }
            // console.log(move.x, move.y);
            p.set(k, move);
        });


        p.forEach((v, k, m) => {
           this.objs.get(k)!.avaliablePlace = new Rectangle(v);
        });
    }

    private initObj() {
        let arcObj0 = new ArcObj(canvas, this.context, new Rectangle(new Point(30, 10)));
        arcObj0.fillStyle = RandomUtil.getRandomRGBColor();
        arcObj0.mass = RandomUtil.random(1, 10);
        this.objs.set(this.createId('Obj'), arcObj0);
        //
        //
        let arcObj1 = new ArcObj(canvas, this.context, new Rectangle(new Point(70, 60)));
        arcObj1.fillStyle = RandomUtil.getRandomRGBColor();
        arcObj1.mass = RandomUtil.random(1, 10);
        this.objs.set(this.createId('Obj'), arcObj1);
        // console.log(this.objs)
    }
}


const canvasContainer = document.querySelector("#canvasContainer")! as HTMLDivElement;
const canvas: HTMLCanvasElement = document.createElement("canvas");
canvasContainer.appendChild(canvas);
const engine = new Engine(canvas, canvas.getContext('2d')!);
engine.draw();

export {engine};

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
    public objs = new Map<string, DrawObj>();
    // public infos = new Map<string, DrawObj>();


    constructor(public canvas: HTMLCanvasElement, public context: CanvasRenderingContext2D) {
        this.setCanvasSize(window);
        this.grid = new SizeGrid(50);
        this.addEvent();
        this.animationFrame();
        this.initObj();
    }

    getExcludeObjs(id?: string): Array<Obj> {
       return this.getObjs().filter(it => it.id != id);
    }
    getObj(id?: string): Obj | undefined {
       let find = this.getObjs().find((it: Obj) => it.id != id);
       return find as Obj | undefined;
    }
    setObj(obj: DrawObj) {
        this.objs.set(obj.id!, obj as DrawObj);
    }
    deleteObj(id?: string) {
        this.objs.delete(id!);
    }
    getObjs(): Array<Obj> {
       return Array.from(this.objs.values());
    }
    // getObjsFromSpaceRectangle(rect: Rectangle): Array<Obj> {
    //    return this.getObjs().filter(it =>
    //        rect.start.x <= it.x && rect.end.x >= it.x &&
    //        rect.start.y <= it.y && rect.end.y >= it.y
    //    );
    // }

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

        this.context.save();
        this.grid.draw(draw);
        this.context.restore();

        this.objs.forEach((it: DrawObj) => {
            this.context.save();
            it.draw(draw);
            this.context.restore();
        });
        // this.infos.forEach(it => {
        //     this.context.save();
        //     it.draw(draw);
        //     this.context.restore();
        // });
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
            const arcObj = new ArcDrawObj(this.createId('Obj')).set(point);
            arcObj.fillStyle = RandomUtil.rgb();
            arcObj.mass =  RandomUtil.scope(1, 5);
            arcObj.volume =  RandomUtil.scope(1, 5);
            this.objs.set(arcObj.id, arcObj);
        });
    }



    public createId(prefix: string) {
        return prefix + '-' +  RandomUtil.alphabet(10);
    }



    private initObj() {
        // let mass = RandomUtil.scope(0.5, 1);
        let volume = RandomUtil.scope(1, 5);
        let mass = RandomUtil.scope(1, 5);
        // let arcObj0 = new ArcObj(canvas, this.context, new Rectangle(new Point(50, 0)));
        let arcObj0 = new ArcDrawObj("arcObj0").set(new PointVector(0, 50));
        arcObj0.acceleration = new PointVector(1, 0, 0);
        arcObj0.e = 1;
        arcObj0.fillStyle = RandomUtil.rgb();
        arcObj0.volume = volume;
        arcObj0.mass = mass;
        this.objs.set(arcObj0.id, arcObj0);
        //
        //
        // let arcObj1 = new ArcDrawObj("arcObj1").set(new PointVector(50, 50));
        let arcObj1 = new ArcDrawObj("arcObj1").set(new PointVector(100, 40));
        arcObj1.acceleration = new PointVector(-1, 0, 0);
        arcObj1.e = 1;
        arcObj1.fillStyle = RandomUtil.rgb();
        arcObj1.volume = volume;
        arcObj1.mass = mass;
        this.objs.set(arcObj1.id, arcObj1);


        // let arcObj2 = new ArcDrawObj("arcObj2").set(new PointVector(100, 50));
        // arcObj2.fillStyle = RandomUtil.rgb();
        // arcObj2.mass = mass; //RandomUtil.scope(5, 15);
        // this.objs.set("arcObj2", arcObj2);

        // let arcObj3 = new ArcDrawObj("arcObj3").set(new PointVector(50, 100));
        // arcObj3.fillStyle = RandomUtil.rgb();
        // arcObj3.mass = mass;
        // this.objs.set(arcObj3.id, arcObj3);


        let ground = new ArcDrawObj("ground").set(new PointVector(50, 100));
        ground.acceleration = new PointVector(0, 0, 0);
        ground.e = 1;
        ground.fillStyle = RandomUtil.rgb();
        ground.edgeLoop = false;
        ground.volume = 5;
        ground.mass = 99;
        this.objs.set(ground.id, ground);

        let ground1 = new ArcDrawObj("ground1").set(new PointVector(51, 100));
        ground1.acceleration = new PointVector(0, 0, 0);
        ground1.e = 1;
        ground1.fillStyle = RandomUtil.rgb();
        ground1.edgeLoop = false;
        ground1.volume = 5;
        ground1.mass = 99;
        this.objs.set(ground1.id, ground1);

        let ground2 = new ArcDrawObj("ground2").set(new PointVector(49, 100));
        ground2.acceleration = new PointVector(0, 0, 0);
        ground2.e = 1;
        ground2.fillStyle = RandomUtil.rgb();
        ground2.edgeLoop = false;
        ground2.volume = 5;
        ground2.mass = 99;
        this.objs.set(ground2.id, ground2);

    }
}


const canvasContainer = document.querySelector("#canvasContainer")! as HTMLDivElement;
const canvas: HTMLCanvasElement = document.createElement("canvas");
canvasContainer.appendChild(canvas);
const engine = new Engine(canvas, canvas.getContext('2d')!);
engine.animationFrame();

export {engine};

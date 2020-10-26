import {Draw} from "@src/draw/Draw";
import {Grid} from "@src/draw/Grid";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
const {map, filter, catchError} = require('rxjs/operators');

const canvasContainer = document.querySelector("#canvasContainer")! as HTMLDivElement;
const canvas: HTMLCanvasElement = document.createElement("canvas");
// canvas.setAttribute('style', 'border: 1px solid #000000');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d')!;
canvasContainer.appendChild(canvas);

// canvas sizing
fromEvent(window, 'resize').subscribe((event: Event) => {
    let target: any = event.target!;
    canvas.width = target['innerWidth'];
    canvas.height = target['innerHeight'];
});



const list = new Array<Draw>();
list.push(new Grid(canvas, ctx));

/////draw
function draw(timestamp: number) {

    // 픽셀 정리
    ctx.restore();
    ctx.setLineDash([]);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    list.forEach(it => {
        ctx.save();
        it.draw();
        ctx.restore();
    });
    // console.log("---", timestamp)
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);


// const keys = Object.keys(essenceManager);
// const values = keys.map(key => `${key}: ${Reflect.get(essenceManager, key)}`);
// console.log(values);


// range(1, 200).pipe(
//     filter((x: any) => x % 2 === 1),
//     map((x: any) => x + x)
// ).subscribe((x: any) => {
//     console.log(x);
// });
//
// const doc: Document = document;
// fromEvent(document.querySelector("#sort"), 'change').subscribe((it: Event) => {
//     console.log(it);
// });
//
//
// const obs$ = ajax(`https://api.github.com/users?per_page=5`).pipe(
//     map((userResponse: any) => console.log('users: ', userResponse)),
//     catchError((error: any) => {
//         console.log('error: ', error);
//         return of(error);
//     })
// );
//
// obs$.subscribe(it => {
//     console.log(it);
// })

// const localization = require("./localization/Localization");
import {localization} from "./localization/Localization";
import {essenceManager} from "./manager/Managers";
// import {Stepper} from "./Stepper";
const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
const {map, filter, catchError} = require('rxjs/operators');


const canvasContainer = document.querySelector("#canvasContainer")! as HTMLDivElement;
const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.setAttribute('style', 'border: 1px solid #000000');
canvas.height = canvas.width = window.innerWidth;
const ctx = canvas.getContext('2d')!;
canvasContainer.appendChild(canvas);

/////draw
function draw(timestamp: number) {
    ctx.beginPath();
    ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw the ellipse's line of reflection
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, 200);
    ctx.lineTo(200, 0);
    ctx.stroke();
    console.log("---", timestamp)
    // window.requestAnimationFrame(draw);
    // window.requestAnimationFrame(draw);
}
fromEvent(window, 'resize').subscribe((event: Event) => {
    let target: any = event.target!;
    canvas.width = target['innerWidth'];
    canvas.height = canvas.width;
});

// let stepper = new Stepper();
// stepper.start({
//     duration: 1,
//     step: (n: number) => {
//         draw(n);
//     }
// });

// window.requestAnimationFrame(draw);
console.log(localization.choice);

essenceManager.essences.forEach(it => {
    const querySelector = document.querySelector("#gageContainer")! as HTMLDivElement;
    // const span: HTMLSpanElement = document.createElement("span");
    const div: HTMLDivElement = document.createElement("div");
    div.setAttribute('style', 'float: left; border: 1px solid #000000; margin: 5px; padding: 5px;');
    const input: HTMLInputElement = document.createElement("input");
    input.type = 'range';
    input.min = '0';
    input.max = '100';
    it.value = (Math.random() * (100 - 0 + 1) + 0);
    input.value = it.value.toString();
    input.className = 'slider';
    // fromEvent(input, 'change').subscribe((event: Event) => {
    fromEvent(input, 'mousemove').subscribe((event: Event) => {
        let target: any = event.target!;
        let newVar = target['value'];
        console.log(newVar);
        it.value = Number(newVar);
    });
    fromEvent(input, 'change').subscribe((event: Event) => {
        console.log(it);
    });
    div.append(localization.type[it.negativeName]);
    div.appendChild(input);
    div.append(localization.type[it.positiveName]);
    querySelector.appendChild(div);
});

const keys = Object.keys(essenceManager);
const values = keys.map(key => `${key}: ${Reflect.get(essenceManager, key)}`);
console.log(values);


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

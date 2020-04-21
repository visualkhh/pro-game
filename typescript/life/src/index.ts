// const localization = require("./localization/Localization");
import localization from "./localization/Localization";
import {essenceManager} from "./manager/Managers";

const {range, fromEvent, interval, Observable, of, Subscription, timer} = require('rxjs');
const {map, filter, catchError} = require('rxjs/operators');



console.log(localization.choice);

essenceManager.essences.forEach(it => {
   const querySelector: HTMLDivElement | null = document.querySelector("#gageContainer");
   // const span: HTMLSpanElement = document.createElement("span");
   const span: HTMLDivElement = document.createElement("div");
   span.setAttribute('style', 'float: left; border: 1px solid #000000; margin: 5px; padding: 5px;');
   const input: HTMLInputElement = document.createElement("input");
   input.type = 'range';
   input.min = '0';
   input.max = '100';
   input.value = it.value.toString();
   // fromEvent(input, 'change').subscribe((event: Event) => {
   fromEvent(input, 'mousemove').subscribe((event: Event) => {
      let target: any = event.target!;
      let newVar = target['value'];
      console.log(newVar);
      it.value = Number(newVar);
   });
   span.append(localization.type[it.negativeName]);
   span.appendChild(input);
   span.append(localization.type[it.positiveName]);
   querySelector?.appendChild(span);
})

const keys = Object.keys(essenceManager);
const values = keys.map(key => `${key}: ${Reflect.get(essenceManager,key)}`)
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

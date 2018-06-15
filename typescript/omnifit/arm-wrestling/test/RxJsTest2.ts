// import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';
import {Subscriber} from 'rxjs/Subscriber';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {Subscription} from 'rxjs/Subscription';

let fullSubscriber;
const o: Observable = Observable.create( (obs: Subscriber<any>) => {
    fullSubscriber = obs;
    obs.next('555');
    console.log('oooooo ' + (obs) )
});

const a: Subscription = o.subscribe( (it) => {
    console.log(it + ' aaa');
});
// a.next('sss');


const b: Subscription = o.subscribe( (it) => {
    console.log(it + ' bbb');
});
// b.next('bbb');


const subscriptions = new Subscription();
subscriptions.add(a).add(b);

const subscription = o
    .subscribe();
// console.log(fullSubscriber === s)
// console.log(s === b)
// console.log(fullSubscriber === b)
//
// o.subscribe();
//
// fullSubscriber.next('ffff')
// //////////////
//
// const subject = new AsyncSubject();
//
// subject.next(42);
// subject.complete();
// subject.next(424);
// subject.complete();
//
//
// var subscription = subject.subscribe(
//     function (x) {
//         console.log('Next: ' + x);
//     },
//     function (err) {
//         console.log('Error: ' + err);
//     },
//     function () {
//         console.log('Completed');
//     });
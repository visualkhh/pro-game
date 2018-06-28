// import 'rxjs/add/operator/map';
// import {of} from 'rxjs/observable/of';
// import {combineLatest} from 'rxjs/observable/combineLatest';
import 'rxjs/add/observable/combineLatest';
// import {interval} from 'rxjs/observable/interval';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';
// import {interval} from 'rxjs/observable/interval';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';
import {flatMap} from 'tslint/lib/utils';

const xs = Observable.interval(100)
    .map((x) => 'first' + x);

const ys = Observable.interval(100)
    .map((x) => 'second' + x);

// const xs = Observable.of([1])
//     .map((x) => 'first' + x);//.filter( (it) => it.length > 10);
//
// const ys = Observable.of([2])
//     .map((x) => 'second' + x);

// const source = xs.combineLatest(
//         ys,
//         function () { return Observable.timer(0); },
//         function () { return Observable.timer(0); },
//         function (x, y) { return x + y; }
//     )
//     .take(5);
//
// const subscription = source.subscribe(
//     function (x) { console.log('Next: ' + x); },
//     function (err) { console.log('Error: ' + err); },
//     function () { console.log('Completed'); });
//

Observable.fl

//////
/*
ar xs = Rx.Observable.interval(100)
    .map(function (x) { return 'first' + x; });

var ys = Rx.Observable.interval(100)
    .map(function (x) { return 'second' + x; });

var source = xs.groupJoin(
    ys,
    function () { return Rx.Observable.timer(0); },
    function () { return Rx.Observable.timer(0); },
    function (x, yy) {
        return yy.select(function (y) {
            return x + y;
        })
    }).mergeAll().take(5);

var subscription = source.subscribe(
    function (x) { console.log('Next: ' + x); },
    function (err) { console.log('Error: ' + err); },
    function () { console.log('Completed'); });
 */

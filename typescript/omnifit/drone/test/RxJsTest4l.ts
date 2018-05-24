// import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';
import {interval} from 'rxjs/observable/interval';
import {AsyncSubject} from 'rxjs/AsyncSubject';

//http://reactivex.io/documentation/ko/subject.html
var subject = new AsyncSubject();

var observerA = {
    next: function (x) { console.log('A next ' + x); },
    error: function (err) { console.log('A error ' + err); },
    complete: function () { console.log('A done'); },
};

subject.subscribe(observerA);

var observerB = {
    next: function (x) { console.log('B next ' + x); },
    error: function (err) { console.log('B error ' + err); },
    complete: function () { console.log('B done'); },
};

setTimeout(function () {
    subject.subscribe(observerB);
}, 2000);

subject.next(1);
subject.next(2);
subject.next(3);

subject.complete()
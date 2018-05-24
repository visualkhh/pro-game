// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';

var subject = new BehaviorSubject(42);
// var subject = new BehaviorSubject(42)

var subscription = subject.subscribe(
    function (x) {
        console.log('Next1: ' + x.toString());
    },
    function (err) {
        console.log('Error1: ' + err);
    },
    function () {
        console.log('Completed1');
    });



var subscription2 = subject.subscribe(
    function (x) {
        console.log('Next2: ' + x.toString());
    },
    function (err) {
        console.log('Error2: ' + err);
    },
    function () {
        console.log('Completed2');
    });
// subject.filter

var subscription3 = subject.filter( (it) => it > 50).subscribe(
    function (x) {
        console.log('Next3: ' + x.toString());
    },
    function (err) {
        console.log('Error3: ' + err);
    },
    function () {
        console.log('Completed3');
    });

// => Next: 42

subscription3.unsubscribe();
subject.next(56);
// => Next: 56

subject.complete();
// => Completed
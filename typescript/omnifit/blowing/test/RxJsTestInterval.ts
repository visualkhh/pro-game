// import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';
import {interval} from 'rxjs/observable/interval';

const observable: Observable = interval(100);

console.log(observable);


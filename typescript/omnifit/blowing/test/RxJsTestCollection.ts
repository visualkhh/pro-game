// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/from';
import 'rxjs/add/operator/toArray';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';
import {interval} from 'rxjs/observable/interval';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';

const map = new Map<string, number>();

map.set('a', 1);
map.set('b', 3);
map.set('c', 5);

const arr = [1, 2, 3, 4, 5, 6, 7, 8];

// console.log( from(map).filter( (it) => it > 2).toArray().subscribe( (it) => console.log(it)) );
console.log( from(arr).filter( (it) => it > 2).toArray().subscribe( (it) => console.log(it)) );
console.log( from(Array.from(new Set([1, 2, 3, 4]).values())).filter( (it) => it > 2).toArray().subscribe( (it) => console.log(it)) );

// Observable.from(targetAuths)
//     .filter(auth=>auth.menuLvl==1)
//     .map(auth=>{
//         Observable.from(targetAuths)
//             .filter(subAuth=>subAuth.menuLvl==2 && auth.urlSeq==subAuth.prntUrlSeq)
//             .map(subAuth=>subAuth as AuthMenu)
//             .toArray()
//             .subscribe(subAuths=>auth.auths=subAuths)
//         return auth;
//     })
//     .toArray()
//     .subscribe(auths => this.auths = auths, console.error);

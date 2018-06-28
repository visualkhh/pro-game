// import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';

let subject: Subject<any>;

let obs: Observer<any>;

const observable = Observable.create((obss: Observer<any>) => {
    obs = obss;
});

const observer = {
    next: (data: any) => {
        console.log('observer next ' + data);
        obs.next(data);
    },
    error : (error: any) => {
        console.log('observer error ' + error);
    },
    complete : () => {
        console.log('observer complete');
    },
};

subject = Subject.create(observer as Observer<any>, observable);
// this.subject = Subject.create(observer as Observer<any>, observable).map((response: MessageEvent): any => {
//     console.log('in  subject ' + response);
//         // const data = response.data;
//         // return data;
//     });



const subScription = subject.subscribe((it) => { console.log('**' + it); });
// a.next('aaaa22a');

subject.next('nenene');

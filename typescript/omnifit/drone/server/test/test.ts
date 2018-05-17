// import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/operator/map';
import {Subject} from 'rxjs/Subject';

class A {
    public subject: Subject<any>;

    public obs: Observer<any>;

    constructor() {
        const observable = Observable.create((obs: Observer<any>) => {
            this.obs = obs;
            this.next = obs.next.bind(obs);
            this.onerror = obs.error.bind(obs);
            this.onclose = obs.complete.bind(obs);
            // this._webSocket.onclose = obs.complete.bind(obs);
        });

        const observer = {
            next: (data: any) => {
                console.log('observer next ' + data);
                this.obs.next(data);
            },
            error : (error: any) => {
                console.log('observer error ' + error);
            },
            complete : () => {
                console.log('observer complete');
            },
        };

        this.subject = Subject.create(observer as Observer<any>, observable);
        // this.subject = Subject.create(observer as Observer<any>, observable).map((response: MessageEvent): any => {
        //     console.log('in  subject ' + response);
        //         // const data = response.data;
        //         // return data;
        //     });
    }

    main(): string {
        console.log('welcome');
        return '---';
    }
    next(name: string): string {
        console.log('next' + name);
        return 'next' + name;
    }
    onerror(): string {
        console.log('onerror');
        return 'onerror';
    }
    onclose(): string {
        console.log('onclose');
        return 'onclose';
    }
}

const a = new A();

const subScription = a.subject.subscribe((it) => { console.log('**' + it); });
a.next('aaaa22a');

a.subject.next('nenene');

// subScription.unsubscribe();
// subScription.unsubscribe();
// a.subject.complete();
// a.subject.unsubscribe();

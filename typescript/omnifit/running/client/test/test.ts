import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';

class A {
    public subject: Subject<any>;

    constructor() {
        const observable = Observable.create((obs: Observer<MessageEvent>) => {
            this.main = obs.next.bind(obs);
            // this._webSocket.onerror = obs.error.bind(obs);
            // this._webSocket.onclose = obs.complete.bind(obs);
        });

        const observer = {
            next: (data: any) => {
                console.log('observer next');
            },
            error : (error: any) => {
                console.log('observer error');
            },
            complete : () => {
                console.log('observer complete');
            },
        };

        // this.subject = Subject.create(observer as Observer<any>, observable).map((response: MessageEvent): any => {
        //     const data = response.data;
        //     return data;
        // });
        this.subject = Subject.create(observer as Observer<any>, observable).map((response: MessageEvent): any => {
                const data = response.data;
                return data;
            });
    }

    main(): string {
        console.log('welcome');
        return '---';
    }
}

const a = new A();
a.subject.subscribe((it) => { console.log('**' + it); });
a.main();
// a.subject.next('nenene');

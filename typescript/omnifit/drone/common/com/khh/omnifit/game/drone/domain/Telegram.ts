// import WebSocket = require('ws');
import {TelegramStatusCode} from '../code/TelegramStatusCode';

export class Telegram<T> {
    public action = '';
    public method = '';
    public status: number;
    public body: T;

    constructor(action: string = '', method: string = '', body: T = new Object() as T, status: number = TelegramStatusCode.OK) {
        this.action = action;
        this.method = method;
        this.status = status;
        this.body = body;
    }

    // lift<R>(operator: Operator<T, R>): Observable<R> {
    //     const observable = new Observable<R>();
    //     observable.source = this;
    //     observable.operator = operator;
    //     return observable;
    // }
    // public getBody(): T | undefined {
    //     if (!ValidUtil.isNullOrUndefined(this.body)){
    //         return this.body as T;
    //     }
    // //     return ConvertUtil.strToObject(String(this.body));
    //     // if (ValidUtil.isString(this.body)){
    //     //     return ConvertUtil.strToObject(String(this.body))
    //     // }else {
    //     //     return this.body
    //     // }
    // }

}

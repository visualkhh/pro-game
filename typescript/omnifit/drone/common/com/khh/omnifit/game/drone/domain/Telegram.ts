// import WebSocket = require('ws');
import {RandomUtil} from '../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {TelegramStatusCode} from '../code/TelegramStatusCode';

export class Telegram<T> {
    public uuid;
    public action;
    public method;
    public status: number;
    public body: T;

    constructor(action = '', method = '', body: T = new Object() as T, status = TelegramStatusCode.OK, uuid?: string) {
        this.action = action;
        this.method = method;
        this.status = status;
        this.body = body;
        if (ValidUtil.isNullOrUndefined(uuid)) {
            this.uuid = RandomUtil.uuid();
        } else {
            this.uuid = uuid;
        }
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

// import WebSocket = require('ws');
import * as WebSocket from 'ws';
import {TelegramStatusCode} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/code/TelegramStatusCode';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Telegram';
import {RandomUtil} from '../../../../../../../../lib-typescript/com/khh/random/RandomUtil';

export class ServerTelegram<T> extends Telegram<T> {
    public ws: WebSocket;

    constructor(ws: WebSocket, action: string = '', method: string = '', body: T = new Object() as T, status: number = TelegramStatusCode.OK, uuid?: string) {
        super(action, method, body, status, uuid)
        this.ws = ws;
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

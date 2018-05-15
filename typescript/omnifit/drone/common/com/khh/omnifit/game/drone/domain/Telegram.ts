import WebSocket = require('ws');
import {StatusCode} from '../../../../../../../server/src/com/khh/omnifit/game/drone/StatusCode';
import {ConvertUtil} from '../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';
import {ValidUtil} from '../../../../../../../lib-typescript/com/khh/valid/ValidUtil';

export class Telegram<T> {
    public action = '';
    public method = '';
    public status: number;
    public body: T;
    public ws: WebSocket;

    constructor(ws: WebSocket, action: string = '', method: string = '', body: T = {} as T, status: number = StatusCode.OK) {
        this.ws = ws;
        this.action = action;
        this.method = method;
        this.status = status;
        this.body = body;
    }

    // public getBody(): any{
    //     return ConvertUtil.strToObject(String(this.body));
        // if (ValidUtil.isString(this.body)){
        //     return ConvertUtil.strToObject(String(this.body))
        // }else {
        //     return this.body
        // }
    // }

}

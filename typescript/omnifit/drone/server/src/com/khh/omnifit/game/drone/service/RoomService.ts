import {interval} from 'rxjs/observable/interval';
import WebSocket = require('ws');
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {CollectionUtil} from '../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {ConvertUtil} from '../../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';
import {RandomUtil} from '../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ServerTelegram} from '../dto/ServerTelegram';
import {SessionManager} from '../session/SessionManager';

export class RoomService {
    static readonly ROOM_WAITING = 'waiting-room';
    private rooms = new Map<string, WebSocket[]>();
    private roomsStatus = new Map<string, Map<string, any>>();

    constructor() {
        this.rooms.set(RoomService.ROOM_WAITING, []);
        this.roomsStatus.set(RoomService.ROOM_WAITING, new Map<string, any>());
        interval(500).subscribe((it) => {
            this.rooms.forEach((v, k) => {
                v.forEach((user) => {
                    user.send(ConvertUtil.toJson(new Telegram('rooms', 'detail', {room: this.roomsStatus.get(k), users: this.getRoom(k, user)})));
                });
            });
        });
    }

    public exitRoom(ws: WebSocket): string[] {
        const r = new Array<string>();
        this.rooms.forEach((v: WebSocket[], k: string, map: Map<string, WebSocket[]>) => {
            CollectionUtil.deleteArrayItem(v, ws, (it) => r.push(k));
            if (RoomService.ROOM_WAITING !== k && v.length <= 0) {
                map.delete(k);
            }
        });
        return r;
    }

    public getRooms(): Map<string, Array<Map<string, any>>> {
        const r = new Map<string, Array<Map<string, any>>>();
        this.rooms.forEach((value, key, map) => {
            const users = new Array<Map<string, any>>();
            value.forEach((it) => users.push(SessionManager.getInstance().get(it)));
            r.set(key, users);
        });
        return r;

    }

    public getRoomWebSocket(name: string): WebSocket[] {
        return this.rooms.get(name) || new Array<WebSocket>();
    }
    public getRoom(name: string, user?: WebSocket): Array<Map<string, any>> {
        const users = Array<Map<string, any>>();
        const list = this.rooms.get(name) || new Array<WebSocket>();
        list.forEach((it) => {
            const map = new Map<string, any>(SessionManager.getInstance().get(it));
            if (!ValidUtil.isNullOrUndefined(user) && user === it) {
                map.set('host', 'host');
            }else {
                map.set('host', 'other');
            }
            users.push(map);
        });
        return users;
    }
    public getRoomKey(user: WebSocket): string {
        let name;
        this.rooms.forEach((v, k) => {
            v.forEach( (it) => {
                if (it === user) {
                    name = k;
                }
            });
        });
        return name;
    }
    public sendRoom(name: string, send: Telegram<any> | string): number {
        let i = 0;
        this.getRoomWebSocket(name).forEach( (it) => {
            it.send(ConvertUtil.toJson(send));
            i++;
        });
        return i;
    }

    makeRoom(ws: WebSocket) {
        this.exitRoom(ws);
        const roomName = RandomUtil.uuid();
        this.rooms.set(roomName, [ws]);
        return roomName;
    }
    joinRoom(name: string, ws: WebSocket) {
        this.exitRoom(ws);
        const wss = this.rooms.get(name);
        if (wss) {
            wss.push(ws);
        }

    }

    putRoom(request: ServerTelegram<any>): void {
        const key = this.getRoomKey(request.ws);
        if (key) {
            const roomStatus = this.roomsStatus.get(key) || new Map<string, any>();
            ConvertUtil.objToMap(request.body).forEach((v, k) => roomStatus.set(k, v));
            this.roomsStatus.set(key, roomStatus);
        }
    }
}

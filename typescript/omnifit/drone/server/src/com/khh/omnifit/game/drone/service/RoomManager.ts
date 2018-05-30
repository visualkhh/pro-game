import 'rxjs/add/observable/from';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import WebSocket = require('ws');
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {CollectionUtil} from '../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {ConvertUtil} from '../../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';
import {RandomUtil} from '../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ServerTelegram} from '../dto/ServerTelegram';
import {SessionManager} from '../session/SessionManager';
import {Room} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Room';

export class RoomManager {

    private static instance: RoomManager;
    private rooms = new Map<string, Room<WebSocket>>();

    //singletone pattern
    //https://basarat.gitbooks.io/typescript/docs/tips/singleton.html
    static getInstance() {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }
    // static readonly ROOM_WAITING = 'waiting-room';
    private constructor() {
        interval(500).subscribe((it) => {
            this.sendRoomsDetail();
        });
        interval(1000).subscribe((it) => {
            this.rooms.forEach((v, k) => {
                //console.log(v.users.length + ' ' + v.startCnt + ' ' + v.endCnt)
                if (v.users.length > 0 && v.startCnt > 0) {
                    v.startCnt = (--v.startCnt);
                    v.status = 'wait';
                }else if (v.users.length > 0 && v.startCnt <= 0 && v.endCnt > 0) {
                    console.log(v.endCnt);
                    // if (v.endCnt >= 60) {
                    //     for (const user of v.users) {
                    //         SessionManager.getInstance().get(user).set('headsetConcentrationHistory', Array<number>());
                    //     }
                    // }
                    v.endCnt = (--v.endCnt);
                    v.status = 'run';
                }else if (v.users.length > 0 && v.startCnt <= 0 && v.endCnt <= 0) {
                    v.status = 'end';
                    //v.users.forEach( (uit) => this.exitRoom(uit));
                }

                for (const user of v.users) {
                    let finishCnt = 2;
                    (SessionManager.getInstance().get(user).get('headsetConcentrationHistory') || Array<number>()).forEach((cit) => cit >= 9 ? finishCnt-- : finishCnt = 2);
                    //console.log('-- ' + finishCnt);
                    if (v.status === 'run' && finishCnt <= 0) {
                        v.status = 'end';
                        break;
                    }
                }
            });
        });
    }

    public sendRoomsDetail() {
        this.rooms.forEach((v, k) => {
            const rv = new Room<any>(v.uuid, v.status, v.startCnt, v.endCnt);
            v.users.forEach((user) => {
                rv.users = this.getRoomUsersDetail(k, user).users;
                user.send(ConvertUtil.toJson(new Telegram('rooms', 'detail', rv)));
            });
        });
    }

    public exitRoom(ws: WebSocket) {
        this.rooms.forEach((v: Room<WebSocket>, k: string, map: Map<string, Room<WebSocket>>) => {
            CollectionUtil.removeArrayItem(v.users, ws);
            if (v.users.length <= 0 ) {
                map.delete(k);
            }
        });
    }

    public getRoom(uuid: string): Room<WebSocket> {
        return this.rooms.get(uuid) || new Room<WebSocket>();
    }

    public getRoomsUserDetail(user?: WebSocket): Map<string, Array<Map<string, any>>> {
        const r = new Map<string, Array<Map<string, any>>>();
        this.rooms.forEach((value, key, map) => {
            const users = new Array<Map<string, any>>();
            value.users.forEach((it) => {
                const ssMap = new Map<string, any>(SessionManager.getInstance().get(it));
                if (!ValidUtil.isNullOrUndefined(user) && user === it) {
                    ssMap.set('host', 'host');
                }else {
                    ssMap.set('host', 'other');
                }
                users.push(ssMap);
            });

            r.set(key, users);
        });
        return r;
    }

    // public getRoomUsersDetail(name: string, user?: WebSocket): Array<Map<string, any>> {
    public getRoomUsersDetail(name: string, user?: WebSocket): Room<any> {
        const gRoom = this.getRoom(name);
        const rRoom = new Room<any>(gRoom.uuid, gRoom.status, gRoom.startCnt, gRoom.endCnt);
        gRoom.users.forEach((it) => {
            const map = new Map<string, any>(SessionManager.getInstance().get(it));
            if (!ValidUtil.isNullOrUndefined(user) && user === it) {
                map.set('host', 'host');
            }else {
                map.set('host', 'other');
            }
            rRoom.pushUser(map);
        });
        return rRoom;
    }
    // public getRoomUsersDetail(name: string, user?: WebSocket): Room<any> {
    //     const gRoom = this.getRoom(name);
    //     const rRoom = new Room<any>(gRoom.uuid, gRoom.status);
    //     gRoom.users.forEach((it) => {
    //         const map = new Map<string, any>(SessionManager.getInstance().get(it));
    //         if (!ValidUtil.isNullOrUndefined(user) && user === it) {
    //             map.set('host', 'host');
    //         }else {
    //             map.set('host', 'other');
    //         }
    //         rRoom.pushUser(map);
    //     });
    //     return rRoom;
    // }

    public getRoomWebSocket(name: string): WebSocket[] {
        return (this.rooms.get(name) || new Room()).users;
    }
    public getRoomKey(user: WebSocket): string {
        let name;
        this.rooms.forEach((v, k) => {
            v.users.forEach( (it) => {
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

    makeWaiteRoom(): Room<WebSocket> {
        //this.exitRoom(ws);
        const uuid = RandomUtil.uuid();
        const room = new Room<WebSocket>(uuid);
        room.status = 'wait';
        this.rooms.set(uuid, room);
        // console.log(ConvertUtil.iteratorToArray(this.rooms.keys()));
        return room;
    }

    getStatusRoom(status: string): Array<Room<WebSocket>> {
        const list = new Array<Room<WebSocket>>();
        this.rooms.forEach( (v, k) => {
            if (status === v.status) {
                list.push(v);
            }
        });
        return list;
    }

    joinOrMakeWaiteRoom(ws: WebSocket) {
        this.exitRoom(ws);
        const rooms = this.getStatusRoom('wait');
        //this.rooms.keys();
        if (rooms && rooms[0]) {
            rooms[0].resetCnt();
            rooms[0].pushUser(ws);
        }else {
            const room = this.makeWaiteRoom();
            room.resetCnt();
            room.pushUser(ws);
        }
    }
    joinFirstStatusRoom(status: string, ws: WebSocket) {
        this.exitRoom(ws);
        const rooms = this.getStatusRoom(name);
        if (rooms && rooms[0]) {
            rooms[0].resetCnt();
            rooms[0].pushUser(ws);
        }
    }

    joinRoom(name: string, ws: WebSocket) {
        this.exitRoom(ws);
        const room = this.rooms.get(name);
        if (room) {
            room.resetCnt();
            room.pushUser(ws);
        }
    }

    putRoom(request: ServerTelegram<any>): void {
        delete request.body.users;
        const key = this.getRoomKey(request.ws);
        const room = this.rooms.get(key) || new Room(key);
        if (key) {
            ConvertUtil.objToMap(request.body).forEach((v, k) => room[k] = v);
        }
        this.rooms.set(key, room);
    }
}

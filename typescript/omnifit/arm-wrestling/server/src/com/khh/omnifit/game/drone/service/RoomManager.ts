import 'rxjs/add/observable/from';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import WebSocket = require('ws');
import {RoomStatusCode} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/code/RoomStatusCode';
import {UserHostCode} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/code/UserHostCode';
import {Room} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Room';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Telegram';
import {Character} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/info/Character';
import {Info} from '../../../../../../../../common/com/khh/omnifit/game/arm-wrestling/info/Info';
import {CollectionUtil} from '../../../../../../../../lib-typescript/com/khh/collection/CollectionUtil';
import {ConvertUtil} from '../../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';
import {RandomUtil} from '../../../../../../../../lib-typescript/com/khh/random/RandomUtil';
import {ValidUtil} from '../../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {ServerTelegram} from '../dto/ServerTelegram';
import {SessionManager} from '../session/SessionManager';

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
        interval(Info.STEP_UNIT).subscribe((it) => {
            this.rooms.forEach((v, k) => {
                //console.log(v.users.length + ' ' + v.startCnt + ' ' + v.endCnt)
                if (v.users.length > 0 && v.startCnt > 0) {
                    v.startCnt = (--v.startCnt);
                    v.status = RoomStatusCode.WAIT;
                }else if (v.users.length > 0 && v.startCnt <= 0 && v.endCnt > 0) {
                    console.log(v.uuid + ' : ' + v.endCnt);
                    // if (v.endCnt >= 60) {
                    //     this.sendRoomsDetail()
                    //     this.userHeadsetClear(v.users);
                    // }
                    v.endCnt = (--v.endCnt);
                    v.status = RoomStatusCode.RUN;
                }else if (v.users.length > 0 && v.startCnt <= 0 && v.endCnt <= 0) {
                    v.status = RoomStatusCode.END;
                    // this.sendRoomsDetail();
                    // this.userHeadsetClear(v.users);
                }

                for (const user of v.users) {
                    let finishCnt = Info.FINISH_CNT;
                    (SessionManager.getInstance().get(user).get('headsetConcentrationHistory') || Array<number>()).forEach((cit) => cit >= 9 ? finishCnt-- : finishCnt = Info.FINISH_CNT);
                    if (v.status === RoomStatusCode.RUN && finishCnt <= 0) {
                        v.status = RoomStatusCode.END;
                        // this.sendRoomsDetail();
                        // this.userHeadsetClear(v.users);
                        break;
                    }
                }
            });
        });
    }

    public userHeadsetClear(users: WebSocket[] | WebSocket) {
        for (const user of new Array<WebSocket>().concat(users)) {
            SessionManager.getInstance().get(user).delete('headsetConcentrationHistory');
            SessionManager.getInstance().get(user).delete('headsetConcentration');
        }
    }
    public userInfoClear(users: WebSocket[] | WebSocket) {
        for (const user of new Array<WebSocket>().concat(users)) {
            SessionManager.getInstance().get(user).delete('name');
        }
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

    // public getRoomsUserDetail(user?: WebSocket): Map<string, Array<Map<string, any>>> {
    public getRoomsUserDetail(user?: WebSocket): Array<Room<any>> {
        const r = new Array<Room<any>>();
        this.rooms.forEach((value, key, map) => {
            const users = new Room<any>(value.uuid, value.status, value.startCnt, value.endCnt);
            value.users.forEach((it) => {
                const ssMap = new Map<string, any>(SessionManager.getInstance().get(it));
                if (!ValidUtil.isNullOrUndefined(user) && ValidUtil.isNullOrUndefined(ssMap.get('host')) && user === it) {
                    ssMap.set('host', UserHostCode.HOST);
                }else if (ValidUtil.isNullOrUndefined(ssMap.get('host'))) {
                    ssMap.set('host', UserHostCode.OTHER);
                }
                users.pushUser(ssMap);
            });

            r.push(users);
        });
        return r;
    }

    // public getRoomUsersDetail(name: string, user?: WebSocket): Array<Map<string, any>> {
    public getRoomUsersDetail(name: string, user?: WebSocket): Room<Map<string, any>> {
        const gRoom = this.getRoom(name);
        const rRoom = new Room<any>(gRoom.uuid, gRoom.status, gRoom.startCnt, gRoom.endCnt);
        gRoom.users.forEach((it) => {
            const map = new Map<string, any>(SessionManager.getInstance().get(it));
            if (!ValidUtil.isNullOrUndefined(user) && ValidUtil.isNullOrUndefined(map.get('host')) && user === it) {
                map.set('host', UserHostCode.HOST);
            }else if (ValidUtil.isNullOrUndefined(map.get('host'))) {
                map.set('host', UserHostCode.OTHER);
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
        room.status = RoomStatusCode.WAIT;
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

    joinOrMakeWaiteRoom(ws: WebSocket): Room<Map<string, any>> {
        this.exitRoom(ws);
        this.userHeadsetClear(ws);
        this.userInfoClear(ws);
        const rooms = this.getStatusRoom(RoomStatusCode.WAIT);
        let selectedRoom;
        //this.rooms.keys();
        if (rooms && rooms[0]) {
            selectedRoom = rooms[0];
        }else {
            const room = this.makeWaiteRoom();
            selectedRoom = room;
        }
        selectedRoom.resetCnt();
        selectedRoom.pushUser(ws);
        this.setNameInRoom(selectedRoom);
        return this.getRoomUsersDetail(selectedRoom.uuid, ws);
    }
    // joinFirstStatusRoom(status: string, ws: WebSocket) {
    //     this.exitRoom(ws);
    //     this.userHeadsetClear(ws);
    //     const rooms = this.getStatusRoom(name);
    //     if (rooms && rooms[0]) {
    //         rooms[0].resetCnt();
    //         rooms[0].pushUser(ws);
    //     }
    // }

    joinOnResetRoom(uuid: string | Room<WebSocket>, ws: WebSocket): Room<WebSocket> | undefined {
        this.exitRoom(ws);
        this.userHeadsetClear(ws);
        this.userInfoClear(ws);
        const room = uuid instanceof Room ? uuid : this.rooms.get(uuid);
        if (room) {
            room.resetCnt();
            room.pushUser(ws);
            this.setNameInRoom(room);
        }
        return room;
    }
    setNameInRoom(room: Room<WebSocket>) {
        //이름지정
        const useNicks = new Set<string>();
        this.getRoomUsersDetail(room.uuid).users.forEach((it) => {
            if (!ValidUtil.isNullOrUndefined(it.get('name')) && UserHostCode.OBSERVER !== it.get('host')) {
                useNicks.add(it.get('name'));
            }
        });
        const availableNick = Array.from(CollectionUtil.ignoreItem(Array.from(Character.NAMES).reverse(), useNicks));
        console.log(Array.from(useNicks) + ' ' + availableNick);
        room.users.forEach( (it) => {
            const userSession = SessionManager.getInstance().get(it);
            if (ValidUtil.isNullOrUndefined(userSession.get('name')) && availableNick.length > 0 && UserHostCode.OBSERVER !== userSession.get('host')) {
                userSession.set('name', availableNick.pop());
            }
        });
    }
    resetRoom(name: string) {
        const room = this.rooms.get(name);
        if (room) {
            room.resetCnt();
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

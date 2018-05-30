import {ValidUtil} from '../../../../../../../lib-typescript/com/khh/valid/ValidUtil';

export class Room<T> {
    static START_CNT = 10;
    static END_CNT = 60;
    public uuid: string;
    public status: string;
    public startCnt: number;
    public endCnt: number;
    public users: T[] = new Array<T>();

    constructor(uuid = '', status = 'wait', startCnt = Room.START_CNT, endCnt = Room.END_CNT, users = new Array<T>()) {
        this.uuid = uuid;
        this.status = status;
        this.startCnt = startCnt;
        this.endCnt = endCnt;
        this.users = users;
    }

    public pushUser(user: T): Room<T> {
        if (ValidUtil.isNullOrUndefined(this.users)) {
            this.users = new Array<T>();
        }
        if (!ValidUtil.isNullOrUndefined(user)) {
            this.users.push(user);
        }
        return this;
    }

    public resetCnt() {
        this.startCnt = Room.START_CNT;
        this.endCnt = Room.END_CNT;
    }
}

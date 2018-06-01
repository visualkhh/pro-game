import {ValidUtil} from '../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {Info} from '../info/Info';

export class Room<T> {

    public uuid: string;
    public status: string;
    public startCnt: number;
    public endCnt: number;
    public users: T[] = new Array<T>();

    constructor(uuid = '', status = 'wait', startCnt = Info.START_CNT, endCnt = Info.END_CNT, users = new Array<T>()) {
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
        this.startCnt = Info.START_CNT;
        this.endCnt = Info.END_CNT;
    }
}

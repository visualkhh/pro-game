import {ValidUtil} from '../../../../../../../lib-typescript/com/khh/valid/ValidUtil';
import {Info} from '../info/Info';
import {Algo} from './Algo';

export class Room {

    public uuid: string;
    public status: string;
    public startCnt: number;
    public endCnt: number;
    public local: Algo;
    public other: Algo;

    constructor(uuid = '', status = 'wait', startCnt = Info.START_CNT, endCnt = Info.END_CNT, local?: Algo, other?: Algo) {
        this.uuid = uuid;
        this.status = status;
        this.startCnt = startCnt;
        this.endCnt = endCnt;
        this.local = local;
        this.other = other;
    }

    public resetCnt() {
        this.startCnt = Info.START_CNT;
        this.endCnt = Info.END_CNT;
    }
}

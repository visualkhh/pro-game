import {SessionManager} from '../session/SessionManager';
import {ServerTelegram} from '../dto/ServerTelegram';
import {ConvertUtil} from '../../../../../../../../lib-typescript/com/khh/convert/ConvertUtil';

export class ProfileService {

    private sessionManager = SessionManager.getInstance();

    updateName(request: ServerTelegram<any>): string {
        this.sessionManager.get(request.ws).set('name', request.body);
        return request.body;
    }
    profile(request: ServerTelegram<any>): Map<string, any> {
        // return ConvertUtil.mapToJson(this.sessionManager.get(request.ws));
        return this.sessionManager.get(request.ws);
    }

    update(request: ServerTelegram<any>): Map<string, any> {
        const userSession = this.sessionManager.get(request.ws);
        ConvertUtil.objToMap(request.body).forEach((v, k) => userSession.set(k, v));
        return userSession;
    }
}

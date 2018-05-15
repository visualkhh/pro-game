import {SessionManager} from '../session/SessionManager';
import {Telegram} from '../../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';

export class ProfileService {

    private sessionManager = SessionManager.getInstance();

    updateName(request: Telegram<any>): string {
        this.sessionManager.get(request.ws).set('name', request.body);
        return request.body;
    }
    profile(request: Telegram<any>): Map<string, any> {
        // return ConvertUtil.mapToJson(this.sessionManager.get(request.ws));
        return this.sessionManager.get(request.ws);
    }
}

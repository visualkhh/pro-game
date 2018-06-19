import {TelegramStatusCode} from '../../../../../../../common/com/khh/omnifit/game/arm-wrestling/code/TelegramStatusCode';
import {RoomSend} from '../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/RoomSend';
import {Telegram} from '../../../../../../../common/com/khh/omnifit/game/arm-wrestling/domain/Telegram';
import {ServerTelegram} from './dto/ServerTelegram';
import {ProfileService} from './service/ProfileService';
import {RoomManager} from './service/RoomManager';

export class DroneRouter {
    private roomService: RoomManager = RoomManager.getInstance();
    private profileService: ProfileService = new ProfileService();

    request(request: ServerTelegram<any>): Telegram<any> {
        const response = new Telegram<any>(request.action, request.method, undefined, TelegramStatusCode.OK, request.uuid);

        if ('rooms' === request.action && 'GET' === request.method.toUpperCase()) {//방목록
            response.body = this.roomService.getRoomsUserDetail();
        }else if ('rooms/detail' === request.action && 'GET' === request.method.toUpperCase()) {//방목록
            response.body = this.roomService.getRoomUsersDetail(request.body);
        }else if ('rooms/detail/send' === request.action && 'POST' === request.method.toUpperCase()) {//방목록
            const rb = request.body as RoomSend;
            response.body = this.roomService.sendRoom(rb.name, rb.msg);
        }else if (request.action.indexOf('rooms/join') === 0 && 'PUT' === request.method.toUpperCase()) {//방들어가기
            response.body = this.roomService.joinOrMakeWaiteRoom(request.ws);
            // const target = (str.match(RegExp('rooms/join/(.+)', 'i')) || []);
            // if (target.length === 2) {
            //     response.body = this.roomService.joinRoom(target[1], request.ws);
            // }else {
            //     response.body = this.roomService.joinOrMakeWaiteRoom(request.ws);
            // }
        }else if ('rooms' === request.action && 'PUT' === request.method.toUpperCase()) {//방 수정하기
            response.body = this.roomService.putRoom(request);
        }else if ('rooms' === request.action && 'DELETE' === request.method.toUpperCase()) {//방나가기 닫기
            response.body = this.roomService.exitRoom(request.ws);
        }else if ('profile' === request.action && 'GET' === request.method.toUpperCase()) {//프로필 보기
            response.body = this.profileService.profile(request);
        }else if ('profile' === request.action && 'POST' === request.method.toUpperCase()) {//프로필 수정
            response.body = this.profileService.updateName(request);
        }else if ('profile' === request.action && 'PUT' === request.method.toUpperCase()) {//프로필 수정
            response.body = this.profileService.update(request);
        }else {
            response.status = TelegramStatusCode.NOTFOUNT;
        }
        return response;
    }
}

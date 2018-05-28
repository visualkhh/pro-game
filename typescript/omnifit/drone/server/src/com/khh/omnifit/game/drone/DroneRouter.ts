import {Telegram} from '../../../../../../../common/com/khh/omnifit/game/drone/domain/Telegram';
import {ProfileService} from './service/ProfileService';
import {StatusCode} from '../../../../../../../common/com/khh/omnifit/game/drone/code/StatusCode';
import {RoomSend} from '../../../../../../../common/com/khh/omnifit/game/drone/domain/RoomSend';
import {ServerTelegram} from './dto/ServerTelegram';
import {RoomManager} from './service/RoomManager';

export class DroneRouter {
    private roomService: RoomManager = RoomManager.getInstance();
    private profileService: ProfileService = new ProfileService();

    request(request: ServerTelegram<any>): Telegram<any> {
        const response = new Telegram<any>(request.action, request.method);

        if (request.action === 'rooms' && 'GET' === request.method.toUpperCase()) {//방목록
            response.body = this.roomService.getRoomsUserDetail();
        }else if (request.action === 'rooms/detail' && 'GET' === request.method.toUpperCase()) {//방목록
            response.body = this.roomService.getRoomUsersDetail(request.body);
        }else if (request.action === 'rooms/detail/send' && 'POST' === request.method.toUpperCase()) {//방목록
            const rb = request.body as RoomSend
            response.body = this.roomService.sendRoom(rb.name, rb.msg);
        }else if (request.action === 'rooms/join' && 'PUT' === request.method.toUpperCase()) {//방들어가기
            response.body = this.roomService.joinOrMakeWaiteRoom(request.ws);
        // }else if (request.action === 'rooms' && 'POST' === request.method.toUpperCase()) {//방만들기
        //     response.body = this.roomService.makeJoinWaiteRoom(request.ws);
        }else if (request.action === 'rooms' && 'PUT' === request.method.toUpperCase()) {//방 수정하기
            response.body = this.roomService.putRoom(request);
        }else if (request.action === 'rooms' && 'DELETE' === request.method.toUpperCase()) {//방나가기 닫기
            response.body = this.roomService.exitRoom(request.ws);
        }else if (request.action === 'profile' && 'GET' === request.method.toUpperCase()) {//프로필 보기
            response.body = this.profileService.profile(request);
        }else if (request.action === 'profile' && 'POST' === request.method.toUpperCase()) {//프로필 수정
            response.body = this.profileService.updateName(request);
        }else if (request.action === 'profile' && 'PUT' === request.method.toUpperCase()) {//프로필 수정
            response.body = this.profileService.update(request);
        }else {
            response.status = StatusCode.NOTFOUNT;
        }
        return response;
    }
}

import * as express from 'express';
import * as http from 'http';
import {IncomingMessage, Server} from 'http';
import {AddressInfo} from 'net';
import * as WebSocket from 'ws';
import {TelegramStatusCode} from '../common/com/khh/omnifit/game/drone/code/TelegramStatusCode';
import {Telegram} from '../common/com/khh/omnifit/game/drone/domain/Telegram';
import {ConvertUtil} from '../lib-typescript/com/khh/convert/ConvertUtil';
import {RandomUtil} from '../lib-typescript/com/khh/random/RandomUtil';
import {DroneRouter} from './src/com/khh/omnifit/game/drone/DroneRouter';
import {ServerTelegram} from './src/com/khh/omnifit/game/drone/dto/ServerTelegram';
import {SessionManager} from './src/com/khh/omnifit/game/drone/session/SessionManager';
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
const app = express();
//initialize a simple http server
const server: Server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const router = new DroneRouter();
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {

    //session
    const session = new Map<string, any>();
    const uuid = RandomUtil.uuid();
    session.set('uuid', uuid);
    //session.set('name', uuid);
    SessionManager.getInstance().sessions.set(ws, session);

    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        const request = ConvertUtil.strToObject(message) as ServerTelegram<any>;
        request.ws = ws;
        const response = router.request(request);
        delete response['ws'];
        const responseStr = ConvertUtil.toJson(response);
        console.log('response: %s', responseStr);
        ws.send(responseStr);
    });

    //router.request(new ServerTelegram(ws, 'rooms/join', 'PUT'));

    const init = new Telegram<Map<string, any>>('welcome', req.method, session, TelegramStatusCode.OK);
    ws.send(ConvertUtil.toJson(init));

    ws.on('close', (closeCode: number) => {
        console.log('websocket closed' + closeCode );
        SessionManager.getInstance().sessions.delete(ws);
        const exitRoom = new ServerTelegram(ws, 'rooms', 'delete');
        router.request(exitRoom);
    });

});

//start our server
server.listen(process.env.PORT || 8999, () => {
    const info: AddressInfo = server.address() as AddressInfo;
    console.log(`Server started on port ${info.port} :)`);
});

// const c = new Clock(5000);
// c.subscribe((it) => {
//     wss.clients.forEach((sit) => {
//        console.log('sit ' + sit);
//     });
// });

import * as express from 'express';
import * as http from 'http';
import {IncomingMessage, Server} from 'http';
import {AddressInfo} from 'net';
import * as WebSocket from 'ws';
import {Clock} from '../lib-typescript/com/khh/clock/Clock';
import {RandomUtil} from '../lib-typescript/com/khh/random/RandomUtil';
import {DroneRouter} from './src/com/khh/omnifit/game/drone/DroneRouter';
import {Telegram} from '../common/com/khh/omnifit/game/drone/domain/Telegram';
import {StatusCode} from './src/com/khh/omnifit/game/drone/StatusCode';
import {SessionManager} from './src/com/khh/omnifit/game/drone/session/SessionManager';
import {ConvertUtil} from '../lib-typescript/com/khh/convert/ConvertUtil';
import {ValidUtil} from '../lib-typescript/com/khh/valid/ValidUtil';
import {RoomService} from './src/com/khh/omnifit/game/drone/service/RoomService';
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
    session.set('name', uuid);
    SessionManager.getInstance().sessions.set(ws, session);

    // console.log(ws);
    //connection is up, let's add a simple simple event ss
    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        const request = ConvertUtil.strToObject(message) as Telegram<any>;
        request.ws = ws;
        const response = router.request(request);
        delete response['ws'];
        ws.send(ConvertUtil.toJson(response));
    });


    router.request(new Telegram(ws, 'rooms/join', 'put', RoomService.ROOM_WAITING));

    const init = new Telegram<Map<string,any>>(ws, 'welcome', req.method, session, StatusCode.OK);
    delete init['ws'];
    ws.send(ConvertUtil.toJson(init));


    ws.on('close', (closeCode: number) => {
        console.log('websocket closed' + closeCode );
        SessionManager.getInstance().sessions.delete(ws);
        const exitRoom = new Telegram(ws, 'rooms', 'delete');
        router.request(exitRoom);
    });

});

//start our server
server.listen(process.env.PORT || 8999, () => {
    const info: AddressInfo = server.address() as AddressInfo;
    console.log(`Server started on port ${info.port} :)`);
});

const c = new Clock(5000);
c.subscribe((it) => {
    wss.clients.forEach((sit) => {
       console.log('sit ' + sit);
    });
});

// console.log(global)
//
// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({ port: 1234 });
// wss.on('connection', function(req) {
//     console.log('good stuff'+req);
//
//     wss.on('request', function(req) {
//         // Parse the requested URL:
//         let url = require('url').parse(req.httpRequest.url);
//
//         // Assume that the token is passed as path:
//         // ws://url/TOKEN
//         let token = url.pathname.substring(1); // .substring(1) to strip off the leading `/`
//
//         // Validate token (implementation-dependent):
//         // if (! isValidToken(token)) return req.reject();
//
//         // Accept the request.
//         return req.accept();
//     });
// });

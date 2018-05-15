import WebSocket = require('ws');

export class SessionManager {

    private static instance: SessionManager;

    private _sessions: Map<WebSocket, Map<string, any>>;
    static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    private constructor() {
        this._sessions = new Map();
    }

    get sessions(): Map<WebSocket, Map<string, any>> {
        return this._sessions;
    }
    get(ws: WebSocket): Map<string, any> {
        return this._sessions.get(ws) || new Map<string, any>();
    }

    public brodcast(msg: string) {
        Array.from(this._sessions.keys()).forEach((value) => value.send(msg));
        // for (const [key, value] of Object.entries(this._sessions)) {
        //     key.send(msg);
        // }
    }

}

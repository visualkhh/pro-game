export class SessionManager {

    private static instance: SessionManager;

    private sessions: Map<WebSocket, string>;
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    private constructor() {
        this.sessions = new Map();
    }
}

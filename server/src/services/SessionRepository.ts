import { SessionService } from './SessionService';

interface Sessions {
  [id: string]: SessionService;
}

export default class SessionRepository {
  private sessions: Sessions = {};

  public save(id: string) {
    if (!this.sessions[id]) {
      this.sessions[id] = new SessionService();
    }
  }
  public findById(id: string): SessionService {
    return this.sessions[id];
  }
}
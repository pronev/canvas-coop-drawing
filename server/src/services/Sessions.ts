import { SessionService } from './SessionService';

interface SessionsSet {
  [id: string]: SessionService;
}

export default class Sessions {
  private static instance: Sessions;
  private sessions: SessionsSet = {};

  private constructor() { }

  public static getInstance(): Sessions {
    if (!Sessions.instance) {
      Sessions.instance = new Sessions();
    }
    return Sessions.instance;
  }

  public add(id: string): SessionService {
    if (!this.sessions[id]) {
      this.sessions[id] = new SessionService();
    }
    return this.sessions[id];
  }
}
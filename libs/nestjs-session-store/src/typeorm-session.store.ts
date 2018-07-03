import { Store } from 'express-session';

export interface UserEntity {

  name: string;
  email: string;

}

export interface SessionEntity {

  sid: string;
  expiresAt: number;
  id: string;
  authorize: string;
  passport: string;
  cookie: string;
  user: UserEntity;

}

export interface Options {
  sessionService;
  userService;
  database?: string;
  ttl?: number;
}

export class TypeormStore extends Store {
  private readonly sessionService;
  private readonly userService;
  private readonly database?: string;
  private readonly ttl: number | undefined;

  constructor(options: Options) {
    super(options);
    if (!options.sessionService) {
      throw new Error('The session service option is required');
    }

    if (!options.userService) {
      throw new Error('The user service option is required');
    }

    this.sessionService = options.sessionService;
    this.userService = options.userService;
    this.database = options.database;
    this.ttl = options.ttl;
  }

  public all = (callback: (error: any, result?: any) => void): void => {
    this.sessionService
      .find()
      .then((sessions: SessionEntity[]) =>
        sessions.map(session => {
          const data: any = {
            cookie: JSON.parse(session.cookie),
            authorize: JSON.parse(session.authorize),
            passport: JSON.parse(session.passport),
          };
          return data;
        }),
      )
      .then((data: any) => callback(null, data))
      .catch((error: any) => callback(error));
  }

  public destroy = (sid: string, callback: (error: any) => void): void => {
    this.sessionService
      .delete(sid)
      .then(() => callback(null))
      .catch((error: any) => callback(error));
  }

  public clear = (callback: (error: any) => void): void => {
    this.sessionService
      .clear()
      .then(() => callback(null))
      .catch((error: any) => callback(error));
  }

  public length = (callback: (error: any, length: number) => void): void => {
    this.sessionService
      .count()
      .then((length: number) => callback(null, length))
      .catch((error: any) => callback(error, 0));
  }

  public get = (sid: string, callback: (error: any, session?: any) => void): void => {
    this.sessionService
      .findOne({ where: { sid } })
      .then(async (session: any | undefined) => {
        const data: any = {};
        if (session && session.cookie) data.cookie = JSON.parse(session.cookie);
        if (session && session.authorize) data.authorize = JSON.parse(session.authorize);
        if (session && session.passport) data.passport = JSON.parse(session.passport);

        // Set authorize to null, or it keeps adding here
        if (session) {
          session.authorize = null;
          await session.save();
        }

        if (Object.keys(data).length) return callback(null, data);
        else return callback(null);
      })
      .catch((error: any) => callback(error));
  }

  public set = async (sid: string, session: any, callback: (error: any) => void) => {
    const ttl = this.getTTL(session);
    const expiresAt = Math.floor(new Date().getTime() / 1000) + ttl;
    const userSession = await this.sessionService.findOne({sid}) || {} as SessionEntity;
    // Set sid if new Session
    if (!userSession.sid) userSession.sid = sid;

    // reset user from storedsession
    userSession.user = null;

    try {
      if (session && session.cookie) userSession.cookie = JSON.stringify(session.cookie);
      if (session && session.passport) userSession.passport = JSON.stringify(session.passport);
      if (session && session.authorize) userSession.authorize = JSON.stringify(session.authorize);
    } catch (error) {
      return callback(error);
    }
    userSession.expiresAt = expiresAt;
    if (session.passport && session.passport.user) {
      userSession.user = await this.userService.findOne(session.passport.user.id);
    }
    if (userSession.id) {
      this.sessionService
        .update({ sid }, userSession)
        .then(() => callback(null))
        .catch((error: any) => callback(error));
    } else {
      this.sessionService
        .save(userSession)
        .then(() => callback(null))
        .catch((error: any) => callback(error));
    }
  }

  public touch = (sid: string, session: any, callback: (error: any) => void): void => {
    const ttl = this.getTTL(session);
    const expiresAt = Math.floor(new Date().getTime() / 1000) + ttl;

    this.sessionService
      .update({ sid }, { expiresAt })
      .then(() => callback(null))
      .catch((error: any) => callback(error));
  }

  private getTTL(session: any): number {
    if (this.ttl) {
      return this.ttl;
    }
    return session.cookie && session.cookie.maxAge
      ? Math.floor(session.cookie.maxAge / 1000)
      : 86400;
  }
}

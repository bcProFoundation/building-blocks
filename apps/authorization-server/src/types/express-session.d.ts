// WORKAROUND TODO: Remove when the connect-mongo types are updated

export {};
declare global {
  interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | 'auto';
    encode?: (val: string) => string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
  }

  class Cookie implements CookieOptions {
    originalMaxAge: number;
    maxAge?: number;
    signed?: boolean;
    expires?: Date;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | 'auto';
    sameSite?: boolean | 'lax' | 'strict' | 'none';
  }

  namespace Express {
    interface SessionData {
      cookie: Cookie;
    }
  }
}

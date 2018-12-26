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
    sessionService: any;
    userService: any;
    database?: string;
    ttl?: number;
}
export declare class TypeormStore extends Store {
    private readonly sessionService;
    private readonly userService;
    private readonly database?;
    private readonly ttl;
    constructor(options: Options);
    all(callback: (error: any, result?: any) => void): void;
    destroy(sid: string, callback: (error: any) => void): void;
    clear(callback: (error: any) => void): void;
    length(callback: (error: any, length: number) => void): void;
    get(sid: string, callback: (error: any, session?: any) => void): void;
    set(sid: string, session: any, callback: (error: any) => void): Promise<void>;
    touch(sid: string, session: any, callback: (error: any) => void): void;
    private getTTL;
}

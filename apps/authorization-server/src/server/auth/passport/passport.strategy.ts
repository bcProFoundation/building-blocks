import * as passport from 'passport';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export function PassportStrategy<T extends Type<any> = any>(
  Strategy: T,
  name?: string | undefined,
): {
  new (...args): T;
} {
  abstract class MixinStrategy extends Strategy {
    abstract validate(...args: any[]): any;
    constructor(...args: any[]) {
      super(...args, (...params: any[]) => this.validate(...params));
      if (name) {
        passport.use(name, this as any);
      } else {
        passport.use(this as any);
      }
    }
  }
  return MixinStrategy;
}

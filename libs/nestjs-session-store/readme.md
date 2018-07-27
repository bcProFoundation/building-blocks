# nestjs-session-store

Provides a TypeORM store for storing and retrieving a session.

## Requirements

This package requires:
 * [nestjs](https://nestjs.com/)
 * [express-session](https://www.npmjs.com/package/express-session)
 * [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
 * [rxjs](https://www.npmjs.com/package/rxjs)

## Install

```bash
npm i -g @nestjs-session-store --prefix='~/.nodejs'
```

## Usage

##### Create User and Session entities
TypeormStore requires User and Session entities. Create classes for these:

```
import { UserEntity } from 'nestjs-session-store';

@Entity()
export class User implements UserEntity {
    ...
}
```
```
import { SessionEntity } from 'nestjs-session-store';

@Entity()
export class Session implements SessionEntity {
    ...
}
```

##### Create TypeormStore instance in a function in main.ts and call it in bootstrap. 

Import TypeormStore, instantiate and bootstrap it.

```
import { TypeormStore } from 'nestjs-session-store';

async function bootstrap() {
...
    setupSession(app);

    await app.listen(3000);
}

function setupSession(app) {
    const configService = new ConfigService();
    const serverConfig = configService.getConfig('server');
    app.use(cookieParser(serverConfig.secretSession));

    const expires = new Date(
        new Date().getTime() +
        Number(serverConfig.expiryDays) * 24 * 60 * 60 * 1000, // 24 hrs * 60 min * 60 sec * 1000 ms
    );

    const cookie = {
        maxAge: Number(serverConfig.cookieMaxAge),
        httpOnly: false,
        secure: true,
        expires,
    };

    if (process.env.NODE_ENV !== 'production') cookie.secure = false;

    const sessionConfig = {
        name: serverConfig.sessionName,
        secret: serverConfig.secretSession,
        store: new TypeormStore({
        sessionService: getRepository(Session),
        userService: getRepository(User),
        }),
        cookie,
        saveUninitialized: false,
        resave: false,
        // unset: 'destroy'
    };

    app.use(expressSession(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());
}
```

## License

[MIT](http://vjpr.mit-license.org)

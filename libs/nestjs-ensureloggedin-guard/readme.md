# nestjs-ensureloggedin-guard

Revokes access to an endpoint if the user is does not have a valid session.

## Requirements

 * This package requires 
   * [nestjs](https://nestjs.com/)
   * [passport](https://www.npmjs.com/package/passport)

## Install

```bash
npm i -g @nestjs-ensureloggedin-guard --prefix='~/.nodejs'
```

## Usage

Import the Guard in your controller.ts file.
```
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
```

Add EnsureLoginGuard to the UseGuards decorator on the endpoint you want to restrict
```
@Get('myaccount')
@UseGuards(EnsureLoginGuard)
myaccount(@Req() req) {
    return { user: req.user ? req.user.email : 'Guest' };
}
``` 

## License

[MIT](http://vjpr.mit-license.org)

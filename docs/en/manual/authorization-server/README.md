# Authorization Server Development

Complete the [development setup](/development/README.md)

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```
SESSION_SECRET=secret
EXPIRY_DAYS=1
COOKIE_MAX_AGE=43200
SESSION_NAME=AS_SESSION
TOKEN_VALIDITY=3600
DB_HOST=localhost
DB_NAME=authorization-server
DB_USER=authorization-server
DB_PASSWORD=admin
BULL_QUEUE_REDIS_HOST=localhost
BULL_QUEUE_REDIS_PORT=6379
BULL_QUEUE_REDIS_PASSWORD=admin
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup hosts file

add `127.0.0.1 *.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Setup server with POST request

`authorization-server` needs to have first client (app), i.e `infrastructure-console` for administration dashboard for all apps, users, roles, scopes and general settings.

- Run the script

```
./scripts/setupwiz.py setup-as http://accounts.localhost:3000 Administrator your@email.com Secret@9000 +919876543210 http://admin.localhost:5000
```

Above script would store the `clientId` and `clientSecret` from response to setup Authorization Server.

- Expected response
```
<Response [201]>
```

This sets up Authorization Server as well as Infrastructure Console

# Authorization Server Development

Complete the [development setup](/development/README.md)

### Setup Backing Services

#### Standard setup

Install mongodb locally using your OS specific installation for MongoDB.

Install redis locally using your OS specific installation for Redis.

#### Docker setup

Run following command as docker allowed user or root to start mongodb container.

```sh
docker run -d --name mongo -p 27017:27017 mongo
```

Run following command as docker allowed user or root to start mongodb container.

```sh
docker run -d --name redis -p 6379:6379 redis
```

In both setup cases start backing services before app development starts.

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
BULL_QUEUE_REDIS_HOST=localhost
BULL_QUEUE_REDIS_PORT=6379
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup hosts file

add `127.0.0.1 accounts.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Setup server with POST request

`authorization-server` needs to have first client (app), i.e `infrastructure-console` for administration dashboard for all apps, users, roles, scopes and general settings.

If a POST request with no body is sent to `http://accounts.localhost:3000/setup` error response will specify required fields.

```
curl -d "fullName=Administrator" \
    -d "email=admin@example.com" \
    -d "phone=%2B919876543210" \
    -d "infrastructureConsoleUrl=http://admin.localhost:5000" \
    -d "issuerUrl=http://accounts.localhost:3000" \
    -d "adminPassword=secret" \
    -X POST http://accounts.localhost:3000/setup \
    -H "Content-Type: application/x-www-form-urlencoded"
```

Store the `clientId` and `clientSecret` from response to setup infrastructure console.

sample response

```
{
  "redirectUris": [
    "http://admin.localhost:5000/index.html",
    "http://admin.localhost:5000/silent-refresh.html"
  ],
  "allowedScopes": ["openid","roles","email"],
  "uuid":"9308ecc8-0d17-45de-9b85-2352edff74cc",
  "clientId":"67e506ca-7da3-43c1-9045-3f5d42711362","clientSecret":"188a19a11e05f966d683147329fbba111454824726702c9aec54d86e42113b36","name":"Infrastructure Console",
  "isTrusted":1
}
```

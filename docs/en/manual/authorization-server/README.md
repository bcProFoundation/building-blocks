# Authorization Server Development

Complete the [development setup](/development/README.md)

### Setup Backing Services

#### Standard setup

Install mongodb locally using your OS specific installation for MongoDB.

Install redis locally using your OS specific installation for Redis.

#### Docker setup

Run following command as docker allowed user or root to start mongodb container.

```sh
# for development
docker run -d --name mongo \
  -p 27017:27017 \
  -e MONGODB_USERNAME=admin \
  -e MONGODB_PASSWORD=admin \
  -e MONGODB_DATABASE=authorization-server \
  bitnami/mongodb:latest
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
DB_USER=authorization-server
DB_PASSWORD=admin
BULL_QUEUE_REDIS_HOST=localhost
BULL_QUEUE_REDIS_PORT=6379
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup hosts file

add `127.0.0.1 accounts.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Setup server with POST request

`authorization-server` needs to have first client (app), i.e `infrastructure-console` for administration dashboard for all apps, users, roles, scopes and general settings.

If a POST request with a body is sent to `http://accounts.localhost:3000/setup` using
`./scripts/setupwiz.py`

- Run the script

```
./scripts/setupwiz.py setup-as http://accounts.localhost:3000 "USER NAME" your@email.com secret +919876543210 http://admin.localhost:5000
```

Above script would store the `clientId` and `clientSecret` from response to setup Authorization Server.

- Expected response
```
<Response [201]>
```

This sets up Authorization Server as well as Infrastructure Console

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

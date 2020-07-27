# Authorization Server Development

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```
SESSION_SECRET=secret
EXPIRY_DAYS=1
COOKIE_MAX_AGE=7.884e+9
SESSION_NAME=AS_SESSION
TOKEN_VALIDITY=3600
DB_HOST=localhost
DB_NAME=authorization-server
DB_USER=authorization-server
DB_PASSWORD=admin
# Optional
REDIS_PROTO=redis
REDIS_HOST=localhost
REDIS_PASSWORD=admin
REDIS_PORT=6379
```

Note: It is important to change the secrets and password. DO NOT USE development passwords or secrets.

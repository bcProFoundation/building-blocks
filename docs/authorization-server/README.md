# Authorization Server Development

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```shell
SESSION_SECRET=secret
COOKIE_MAX_AGE=7.884e+9
SESSION_NAME=AS_SESSION
TOKEN_VALIDITY=3600
DB_HOST=localhost
DB_NAME=authorization-server
DB_USER=authorization-server
DB_PASSWORD=admin
# Optional
EVENTS_PROTO=mqtt
EVENTS_HOST=localhost
EVENTS_USER=user
EVENTS_CLIENT_ID=building-blocks
EVENTS_PASSWORD=changeit
EVENTS_PORT=1883
```

Note: It is important to change the secrets and password. DO NOT USE development passwords or secrets.

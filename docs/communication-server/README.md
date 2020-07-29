# Communication Server Development

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```shell
DB_HOST=localhost
DB_NAME=communication-server
DB_USER=communication-server
DB_PASSWORD=admin
# Optional
REDIS_PROTO=redis
REDIS_HOST=localhost
REDIS_PASSWORD=admin
REDIS_PORT=6379
```

Note: It is important to change the secrets and password. DO NOT USE development passwords or secrets in production.

Use Communication Server to setup personal and system email accounts, cloud storage accounts.

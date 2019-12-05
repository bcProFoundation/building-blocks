# Infrastructure Console Development

Complete the [development setup](/development/README.md)

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```
DB_HOST=localhost
DB_NAME=infrastructure-console
DB_USER=infrastructure-console
DB_PASSWORD=admin
# Optional
ES_HOST=localhost
ES_USER=bb-dev-ic
ES_PASSWORD=admin
ES_STREAM=$bb-dev
BROADCAST_HOST=localhost
BROADCAST_PORT=3112
```

Note: It is important to change the secrets and password. DO NOT USE development passwords or secrets in production.

Use Infrastructure console to as an adminstration panel for all clients, users and services.

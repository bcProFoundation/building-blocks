# Development Installation

- Install Docker and Docker compose
- Clone Building Blocks Repository and Start the backing services

```sh
git clone https://gitlab.com/castlecraft/building-blocks
cd building-blocks/docker
nano .env # setup required environment variables mentioned below
docker-compose -f docker-compose.yml up -d
```

Required environment variables in `.env` file:

```
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=test_authorization-server
MONGODB_ROOT_PASSWORD=admin
REDIS_PASSWORD=admin
```

Install NodeJS global commands

```
npm i lerna @angular/cli @nestjs/cli -g
```

Bootstrap dependencies

```
cd building-blocks # change directory to repo root
npm i
lerna bootstrap
```

All apps dependencies and services are up and downloaded. Refer App's development documentation for further development.

# Commands for testing

```
# NestJS unit tests
npm run test:server

# Drop databases for auth-server e2e
mongo admin -u root -p admin --authenticationDatabase admin
> use test_authorization-server
> db.dropDatabase()
> exit

# NestJS e2e/integration
npm run test:e2e

# Angular unit tests
npm run test --watch=false --browsers ChromeHeadless

# Angular e2e
npm run e2e

# Format Code and lint
npm run format && npm run lint --fix
```

# TypeScript API Documentation

* [Authorization Server]({{ book.docUrl }}/api/authorization-server/)
* [Infrastructure Console]({{ book.docUrl }}/api/infrastructure-console/)
* [Identity Provider]({{ book.docUrl }}/api/identity-provider/)
* [Communication Server]({{ book.docUrl }}/api/communication-server/)

# ReST API Swagger Docs

ReST API Docs for each app can be accessed at `/api-docs` and `/api-docs-json`

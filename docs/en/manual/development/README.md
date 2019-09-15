# Development Installation

### Setup hosts file

add `127.0.0.1 *.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Install Prerequisites

- Docker (to run backing services containers for eventstore and mongo)
- Docker compose (easy bootstrap of development setup)
- NVM / NodeJS (use nvm to manage different node versions required)
- Python and Python Requests (to setup backend apps on first run)
- VS Code (Editor and NodeJS/TypeScript IDE)

Note: All requirements can run native on Linux, Mac or Windows.

### Install NodeJS global commands

```sh
# use nvm for better control and secure node environments for users.
# DO NOT USE sudo or root privileges
npm i lerna @angular/cli @nestjs/cli -g
```

### Clone Repository and set working directory

```sh
git clone https://gitlab.com/castlecraft/building-blocks
cd building-blocks
```

### Bootstrap NodeJS package dependencies

```sh
rm -fr node_modules && npm i && lerna clean -y && lerna bootstrap
```

### Setup Environment Variables

Required environment variables to start backing services in `.env` file:

```sh
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=test_authorization-server
MONGODB_ROOT_PASSWORD=admin
```

For required environment variables, place appropriate `.env` files under each app's package root

- refer [Authorization Server](/authorization-server/README.md) `.env` file
- refer [Communication Server](/communication-server/README.md) `.env` file
- refer [Identity Provider](/identity-provider/README.md) `.env` file
- refer [Infrastructure Console](/infrastructure-console/README.md) `.env` file

Execute following to copy example env files

```sh
cp docker/env-example/backing-services-env .env
cp docker/env-example/authorization-server-env apps/authorization-server/.env
cp docker/env-example/communication-server-env apps/communication-server/.env
cp docker/env-example/identity-provider-env apps/identity-provider/.env
cp docker/env-example/infrastructure-console-env apps/infrastructure-console/.env
```

### Start Backing Services and initialize dbs

```sh
docker-compose --project-name bb -f docker/docker-compose.yml up -d
```

Wait for mongodb to start

```sh
docker logs bb_mongo_1 --follow
```

Execute following command to set users and dbs

```sh
docker exec -it bb_mongo_1 /docker-entrypoint-initdb.d/createdatabases.sh
```

### Start apps and frontends

Start Development backend and frontend using following commands

```
# for packages in apps/ directory,
# execute following command from the app package root
npm run start:debug

# for packages in frontends/ directory,
# execute following command from the frontend package root
npm start
```

or use VS Code Setup, refer [example](/development/vscode.md)

### Run development setup script

Execute to initialize administrator user and core trusted clients

Note:

- The password must be at least 10 characters long
- The password must contain at least one uppercase letter
- The password must contain at least one number
- The password must contain at least one special character
- The password may not contain sequences of three or more repeated characters
- phone must be MobileE164. (ie. +911234567890)
- email must be valid email address

```
# export required environment variables
export ADMIN_FULL_NAME="Mr Administrator"
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=Secret@9876
export ADMIN_PHONE=+919876543210
export ORGANIZATION_NAME="Example Inc"

# Run script
./scripts/setup-dev.sh

# Output
Setting Up Authorization Server and Infrastructure Console
<Response [201]>
Setting Up Identity Provider
<Response [201]>
Setting Up Communication Server
<Response [201]>
```

All apps dependencies and services are up for debug and development.

### Commands for testing

```
# NestJS unit tests
lerna run test:server

# Drop databases for auth-server e2e
mongo admin -u root -p admin --authenticationDatabase admin
> use test_authorization-server
> db.dropDatabase()
> exit

# Or use command to drop test database
echo -e "use test_authorization-server;\n db.dropDatabase()" | mongo -u root -p admin --authenticationDatabase admin

# NestJS e2e/integration
lerna run test:e2e

# Angular unit tests
export NODE_ENV=test
lerna run test

# Angular e2e
lerna --concurrency 1 run e2e

# Check format
lerna run format:check

# Check Linting
lerna run lint
```

### Commands to format code and lint fixes

```
# To execute from project root
lerna run format && lerna run lint -- --fix

# OR execute from app or frontend package root
npm run format && npm run lint -- --fix
```

# TypeScript API Documentation

* [Authorization Server]({{ book.docUrl }}/api/authorization-server/)
* [Infrastructure Console]({{ book.docUrl }}/api/infrastructure-console/)
* [Identity Provider]({{ book.docUrl }}/api/identity-provider/)
* [Communication Server]({{ book.docUrl }}/api/communication-server/)
* [Admin Client]({{ book.docUrl }}/api/admin-client/)
* [Authorization Client]({{ book.docUrl }}/api/authorization-client/)
* [Identity Provider]({{ book.docUrl }}/api/identity-client/)

# ReST API Swagger Docs

ReST API Docs for each app can be accessed at `/api-docs` and `/api-docs-json`

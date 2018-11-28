# Installation

Install Docker and Docker compose

Install Portainer and letsencrypt nginx

Install Authorization Server

Install Infrastructure console

# TypeScript API Documentation

* [Authorization Server]({{ book.docUrl }}/api/authorization-server/)
* [Infrastructure Console]({{ book.docUrl }}/api/infrastructure-console/)
* [Identity Provider]({{ book.docUrl }}/api/identity-provider/)
* [Communication Server]({{ book.docUrl }}/api/communication-server/)

# Commands for testing

```
# NestJS unit tests
yarn test:server

# Drop databases for auth-server e2e
echo -e "use test_authorization-server\ndb.dropDatabase()" | mongo

# NestJS e2e/integration
yarn test:e2e

# Angular unit tests
yarn test:client --watch=false --browsers ChromeHeadless

# Angular e2e
yarn e2e

# Format Code and lint
yarn format && yarn lint --fix
```

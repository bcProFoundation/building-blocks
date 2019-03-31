#!/usr/bin/env bash

# Update packages

# Root Dependencies
./node_modules/.bin/npm-check --update

# Authorization Server
./node_modules/.bin/npm-check --update apps/authorization-server

# Communication Server
./node_modules/.bin/npm-check --update apps/communication-server

# Identity Provider
./node_modules/.bin/npm-check --update apps/identity-provider

# Infrastructure Console
./node_modules/.bin/npm-check --update apps/infrastructure-console

# Authorization Client
./node_modules/.bin/npm-check --update frontends/authorization-client

# Admin Client
./node_modules/.bin/npm-check --update frontends/admin-client

# Identity Client
./node_modules/.bin/npm-check --update frontends/identity-client

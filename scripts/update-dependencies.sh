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

# NestJS EnsureLoggedInGuard
./node_modules/.bin/npm-check --update libs/nestjs-ensureloggedin-guard

# NestJS Session Store
./node_modules/.bin/npm-check --update libs/nestjs-session-store

#!/usr/bin/env bash
export NODE_ENV=test

# Lint for Identity Provider
pushd apps/identity-provider
yarn lint
popd

# Lint for Authorization Server
pushd apps/authorization-server
yarn lint && yarn format:check
popd

# Lint for Resource Server
pushd apps/resource-server
yarn lint
popd

# Lint for nestjs-ensureloggedin-guard
pushd libs/nestjs-ensureloggedin-guard
yarn lint
popd

# Lint for nestjs-session-store
pushd libs/nestjs-session-store
yarn lint
popd

# Lint for craft-account-manager
pushd libs/craft-account-manager
yarn lint
popd

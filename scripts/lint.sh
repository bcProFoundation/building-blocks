#!/usr/bin/env bash
export NODE_ENV=test

# Lint for Identity Provider
pushd apps/identity-provider
yarn lint
popd

# Lint for Resource Server
pushd apps/resource-server
yarn lint
popd

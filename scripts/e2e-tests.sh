#!/usr/bin/env bash
export NODE_ENV=test

# e2e Test for Identity Provider
pushd apps/identity-provider
yarn test:e2e
popd

# e2e Test for Resource Server
pushd apps/resource-server
yarn test:e2e
popd

# IDP Angular Tests
pushd apps/identity-provider
yarn test:client
popd

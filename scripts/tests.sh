#!/usr/bin/env bash
export NODE_ENV=test
pushd apps/identity-provider && yarn lint && yarn test && yarn test:e2e && popd
pushd apps/resource-server && yarn lint && yarn test && yarn test:e2e && popd

#!/usr/bin/env bash
export NODE_ENV=test

# e2e Test for Authorization Server Angular
pushd apps/authorization-server
yarn e2e
popd

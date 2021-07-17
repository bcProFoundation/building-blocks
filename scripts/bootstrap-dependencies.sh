#!/bin/bash

# Script needs to be executed from
# building-blocks lerna / monorepo root
rm -fr node_modules && yarn
lerna clean -y && lerna bootstrap

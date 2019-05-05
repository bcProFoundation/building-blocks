#!/bin/bash

unset npm_config_prefix
source $HOME/.nvm/nvm.sh
rm -fr node_modules && npm i
lerna clean -y
lerna bootstrap --scope={authorization-server,communication-server,identity-provider,infrastructure-console}
nvm use lts/dubnium
lerna bootstrap --scope={admin-client,authorization-client,identity-client}

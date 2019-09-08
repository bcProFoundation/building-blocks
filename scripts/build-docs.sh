#!/usr/bin/env bash
echo "Building Authorization Server Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/authorization-server \
    -p apps/authorization-server/tsconfig.json \
    --name "Authorization Server"

echo "Building Communication Server Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/communication-server \
    -p apps/communication-server/tsconfig.json \
    --name "Communication Server"

echo "Building Identity Provider Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/identity-provider \
    -p apps/identity-provider/tsconfig.json \
    --name "Identity Provider (Server)"

echo "Building Infrastructure Console Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/infrastructure-console \
    -p apps/infrastructure-console/tsconfig.json \
    --name "Infrastructure Console (Server)"

echo "Building Admin Client Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/admin-client \
    -p frontends/admin-client/tsconfig.json \
    --name "Admin Client"

echo "Building Authorization Client Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/authorization-client \
    -p frontends/authorization-client/tsconfig.json \
    --name "Authorization Client"

echo "Building Identity Client Docs"
./node_modules/.bin/compodoc \
    -d ./public/api/identity-client \
    -p frontends/identity-client/tsconfig.json \
    --name "Identity Client"

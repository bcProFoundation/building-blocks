#!/usr/bin/env bash
echo "Building Authorization Server Docs"
./node_modules/.bin/typedoc\
    --out public/api/authorization-server \
    apps/authorization-server/src\
    --name "Authorization Server"

echo "Building Communication Server Docs"
./node_modules/.bin/typedoc \
    --out public/api/communication-server \
    apps/communication-server/src \
    --name "Communication Server"

echo "Building Identity Provider Docs"
./node_modules/.bin/typedoc \
    --out public/api/identity-provider \
    apps/identity-provider/src \
    --name "Identity Provider"

echo "Building Infrastructure Console Docs"
./node_modules/.bin/typedoc \
    --out public/api/infrastructure-console \
    apps/infrastructure-console/src \
    --name "Infrastructure Console"

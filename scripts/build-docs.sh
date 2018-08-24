#!/usr/bin/env bash
echo "Building Authorization Server Docs"
./node_modules/.bin/typedoc\
    --out public/api/authorization-server\
    apps/authorization-server/src\
    --name "Authorization Server"

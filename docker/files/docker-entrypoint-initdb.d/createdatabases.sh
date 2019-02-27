#!/usr/bin/env bash

echo 'Creating application user(s) and db(s)'

mongo authorization-server \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: 'authorization-server', pwd: '$MONGODB_PASSWORD', roles:[{role:'dbOwner', db: 'authorization-server'}]});"

mongo identity-provider \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: 'identity-provider', pwd: '$MONGODB_PASSWORD', roles:[{role:'dbOwner', db: 'identity-provider'}]});"

mongo infrastructure-console \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: 'infrastructure-console', pwd: '$MONGODB_PASSWORD', roles:[{role:'dbOwner', db: 'infrastructure-console'}]});"

mongo communication-server \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: 'communication-server', pwd: '$MONGODB_PASSWORD', roles:[{role:'dbOwner', db: 'communication-server'}]});"

mongo test_authorization-server \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: 'authorization-server', pwd: '$MONGODB_PASSWORD', roles:[{role:'dbOwner', db: 'test_authorization-server'}]});"

#!/bin/bash

chown -R craft:craft /home/craft/identity-provider/files

function checkEnv() {
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
  if [[ -z "$DB_NAME" ]]; then
    echo "DB_NAME is not set"
    exit 1
  fi
}

function checkConnection() {
  # Wait for mongodb
  dockerize -wait tcp://$DB_HOST:27017 -timeout 30s
}

function configureServer() {
  if [ ! -f .env ]; then
    dockerize -template docker/env.tmpl:.env
  fi
}
export -f configureServer

if [ "$1" = 'rollback' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  su craft -c "bash -c configureServer"
  # Rollback Migrations
  echo "Rollback migrations"
  # su craft -c "./node_modules/.bin/migrate down updateRoleScopeUuid -d mongodb://$DB_HOST:27017/$DB_NAME"
fi

if [ "$1" = 'start' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  su craft -c "bash -c configureServer"
  # Run Migrations
  echo "Run migrations"
  # su craft -c "./node_modules/.bin/migrate up -d mongodb://$DB_HOST:27017/$DB_NAME"

  export NODE_ENV=production
  su craft -c "node dist/out-tsc/main.js"
fi

exec runuser -u craft "$@"

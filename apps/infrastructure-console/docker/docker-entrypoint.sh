#!/bin/sh

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

if [ "$1" = 'rollback' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  configureServer
  # TODO: revert Migrations
  echo "revert migrations"
fi

if [ "$1" = 'start' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  configureServer
  # TODO: Run Migrations
  echo "run migrations"
  export NODE_ENV=production
  node dist/out-tsc/main.js
fi

exec "$@"

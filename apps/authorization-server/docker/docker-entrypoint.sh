#!/bin/sh

function checkEnv() {
  if [[ -z "$SESSION_SECRET" ]]; then
    echo "SESSION_SECRET is not set"
    exit 1
  fi
  if [[ -z "$EXPIRY_DAYS" ]]; then
    echo "EXPIRY_DAYS is not set"
    exit 1
  fi
  if [[ -z "$COOKIE_MAX_AGE" ]]; then
    echo "COOKIE_MAX_AGE is not set"
    exit 1
  fi
  if [[ -z "$SESSION_NAME" ]]; then
    echo "SESSION_NAME is not set"
    exit 1
  fi
  if [[ -z "$TOKEN_VALIDITY" ]]; then
    echo "TOKEN_VALIDITY is not set"
    exit 1
  fi
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
  if [[ -z "$DB_NAME" ]]; then
    echo "DB_NAME is not set"
    exit 1
  fi
  if [[ -z "$BULL_QUEUE_REDIS_HOST" ]]; then
    echo "BULL_QUEUE_REDIS_HOST is not set"
    exit 1
  fi
    if [[ -z "$BULL_QUEUE_REDIS_PORT" ]]; then
    echo "BULL_QUEUE_REDIS_HOST is not set"
    exit 1
  fi
}

function checkConnection() {
  # Wait for mongodb
  dockerize -wait tcp://$DB_HOST:27017 -timeout 30s

  # Wait for redis for bull queue
  dockerize -wait tcp://$BULL_QUEUE_REDIS_HOST:$BULL_QUEUE_REDIS_PORT -timeout 30s
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

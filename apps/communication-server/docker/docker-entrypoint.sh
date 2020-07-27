#!/bin/bash

function checkEnv() {
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
  if [[ -z "$DB_NAME" ]]; then
    echo "DB_NAME is not set"
    exit 1
  fi
  if [[ -z "$DB_USER" ]]; then
    echo "DB_USER is not set"
    exit 1
  fi
  if [[ -z "$DB_PASSWORD" ]]; then
    echo "DB_PASSWORD is not set"
    exit 1
  fi
  if [[ -z "$NODE_ENV" ]]; then
    echo "NODE_ENV is not set"
    exit 1
  fi
  if [[ -z "$REDIS_PROTO" ]]; then
    export REDIS_PROTO=redis
  fi
}

function checkConnection() {
  # Wait for services
  su craft -c "node ./docker/check-db.js"
  if [[ ! -z "$REDIS_HOST" ]] && [[ ! -z "$REDIS_PORT" ]]; then
    echo "Connect Redis . . ."
    timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' $REDIS_HOST $REDIS_PORT
  fi
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${NODE_ENV}
      ${DB_HOST}
      ${DB_NAME}
      ${DB_USER}
      ${DB_PASSWORD}' \
      < docker/env.tmpl > .env

    if [[ ! -z "$REDIS_PROTO" ]] &&
      [[ ! -z "$REDIS_HOST" ]] &&
      [[ ! -z "$REDIS_PORT" ]] &&
      [[ ! -z "$REDIS_PASSWORD" ]]; then
      envsubst '${REDIS_PROTO}
        ${REDIS_HOST}
        ${REDIS_PORT}
        ${REDIS_PASSWORD}'\
        < docker/env-redis.tmpl >> .env
    fi
  fi
}
export -f configureServer

if [ "$1" = 'start' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  su craft -c "bash -c configureServer"
  su craft -c "node dist/out-tsc/main.js"
fi

exec runuser -u craft "$@"

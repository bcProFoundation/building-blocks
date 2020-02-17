#!/bin/bash

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
}

function checkConnection() {
  # Wait for services
  echo "Connect MongoDB . . ."
  timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' $DB_HOST 27017

  if [[ ! -z "$ES_HOST" ]]; then
    echo "Connect EventStore . . ."
    timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' $ES_HOST 1113
  fi

  if [[ ! -z "$BROADCAST_HOST" ]] && [[ ! -z "$BROADCAST_PORT" ]]; then
    echo "Connect Broadcast Service . . ."
    timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' $BROADCAST_HOST $BROADCAST_PORT
  fi
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${NODE_ENV}
      ${SESSION_SECRET}
      ${EXPIRY_DAYS}
      ${COOKIE_MAX_AGE}
      ${SESSION_NAME}
      ${TOKEN_VALIDITY}
      ${DB_HOST}
      ${DB_NAME}
      ${DB_USER}
      ${DB_PASSWORD}' \
      < docker/env.tmpl > .env

    if [[ ! -z "$ES_HOST" ]] && [[ ! -z "$ES_USER" ]] &&
      [[ ! -z "$ES_PASSWORD" ]] && [[ ! -z "$ES_STREAM" ]]; then
      envsubst '${ES_HOST}
        ${ES_USER}
        ${ES_PASSWORD}
        ${ES_STREAM}' \
        < docker/env-es.tmpl >> .env
    fi
    if [ ! -z "$BROADCAST_HOST" ] && [ ! -z "$BROADCAST_PORT" ]; then
      envsubst '${BROADCAST_HOST}
        ${BROADCAST_PORT}' \
        < docker/env-bs.tmpl >> .env
    fi
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
fi

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

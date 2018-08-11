#!/bin/sh

function checkMysqlRootPassword() {
  if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
    echo "MYSQL_ROOT_PASSWORD is not set"
    exit 1
  fi
}

function checkDBHost() {
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
}

function checkDBConnection() {
  RETRY=0
  while ! mysqladmin ping -h$DB_HOST -uroot -p$MYSQL_ROOT_PASSWORD --silent; do
      echo "Waiting for mariadb connection"
      sleep 1
      RETRY=$((RETRY + 1))
      if [ "$RETRY" -eq 30 ]; then
          echo "DB not connected after 30 retries"
          exit 1
      fi
  done
}

if [ "$1" = 'rollback' ]; then
  # Validate if MYSQL_ROOT_PASSWORD is set.
  checkMysqlRootPassword
  # Validate if DB_HOST is set.
  checkDBHost
  # Validate DB Connection
  checkDBConnection
  # TODO: revert Migrations
  echo "revert migrations"
fi

if [ "$1" = 'start' ]; then
  # Validate if MYSQL_ROOT_PASSWORD is set.
  checkMysqlRootPassword
  # Validate if DB_HOST is set.
  checkDBHost
  # Validate DB Connection
  checkDBConnection
  # Create config
  craft server --sessionName "IDP_SESSION"
  # Create database
  craft database --host $DB_HOST --password $MYSQL_ROOT_PASSWORD
  # TODO: Run Migrations
  echo "run migrations"
  # TODO: change to package.json script
  export NODE_ENV=production
  node dist/out-tsc/main.js
fi

exec "$@"

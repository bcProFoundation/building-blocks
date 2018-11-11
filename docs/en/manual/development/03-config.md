# Config

All the configuration is from part of `.env` file placed at the root of each app.

`.env` remains same over various deploys (development, test, production, etc).

Only configuration values set in `.env` file change as per deploy.

`dockerize` is used to automatically generate .env file from environment variables and template.

`dockerize` is used during CI tests and in docker container of the app to setup config during production deploy.

# Config

All the configuration is from part of `.env` file placed at the root of each app.

`.env` remains same over various deploys (development, test, production, etc).

Only configuration values set in `.env` file change as per deployment.

`envsubst` is used to automatically generate .env file from environment variables and template.

`envsubst` is used during setup of CI tests

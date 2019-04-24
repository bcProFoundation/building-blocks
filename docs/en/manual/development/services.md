# Backing Services

Backing services like `mongodb` and `redis` need to be attached to app container.

`.env` config stores the setting based on environment variables.

These services are handy as they can be mounted in development setup.

Same images of backing services are mounted for development as well as for production.

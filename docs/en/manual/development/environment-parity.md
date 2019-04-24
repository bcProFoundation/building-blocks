# Environment Parity

- there is only one `.env` file.
- configuration needs to change as per deploy.
- `NODE_ENV=test` conditionally changes the behaviour of the code. This is done to avoid datastore connection in case of unit testing. It mocks certain values instead of using stored data.
- To avoid this conditional change pass any other value, e.g. `NODE_ENV=test-e2e`
- Same docker images are used for setting up backing services during development as well as production.

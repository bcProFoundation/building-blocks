# Testing Authorization Server

### Unit tests for NestJS

Object creation as per required dependencies is at least tested.

### E2E tests for NestJS

Following tests are run with mongodb as backing service (to test closest to production env)

You will need to setup a mock mongodb for these test to run successfully.
- Run the following command to create a mock testing DB.

```sh
# for e2e testing
docker run -d --name test_mongo \
  -p 27017:27017 \
  -e MONGODB_USERNAME=admin \
  -e MONGODB_PASSWORD=admin \
  -e MONGODB_DATABASE=test_authorization-server \
  bitnami/mongodb:latest
```

### Authorization Server

- Auth E2E
- OAuth 2.0 E2E

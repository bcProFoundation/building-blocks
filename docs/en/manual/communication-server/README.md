# Authorization Server Development

Complete the [development setup](/development/README.md)

### Setup Backing Services

#### Standard setup

Install mongodb locally using your OS specific installation for MongoDB.

Install rabbitmq locally using your OS specific installation for RabbitMQ.

#### Docker setup

Run following command as docker allowed user or root to start mongodb container.

```sh
docker run -d --name mongo -p 27017:27017 mongo
```

Run following command as docker allowed user or root to start rabbitmq container with management plugin.

```sh
docker run -d --hostname micro-rabbit --name alpha-rabbit -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=secret rabbitmq:3-management
```

Note: pass secrets as environment variables

In both setup cases start backing services before app development starts.

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```
DB_HOST=mongo
DB_NAME=communication-server
DB_USER=communication-server
DB_PASSWORD=admin
AMQP_HOST=localhost
AMQP_PORT=5672
AMQP_USER=admin
AMQP_PASSWORD=secret
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup hosts file

add `127.0.0.1 connect.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Setup server with POST request

Add Client using Infrastructure console to obtain clientId, clientSecret. Use these to setup the server.

If a POST request with no body is sent to `http://connect.localhost:4100/setup` error response will specify required fields.

Use `clientId` and `clientSecret` from response of `authorization-server` setup.

```
curl -d "appURL=http://connect.localhost:4100" \
    -d "authServerURL=http://accounts.localhost:3000" \
    -d "clientId=d318d6cb-2b60-4afa-bd1c-9b9f9fa068a2" \
    -d "clientSecret=472188a19a11e6702c9aec54d86e42113b305f966d683147329fbba111454826" \
    -X POST http://connect.localhost:4100/setup \
    -H "Content-Type: application/x-www-form-urlencoded"
```

Sample response

```
Response 201
```

Use Communication Server to setup personal and system Email Accounts.

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
AMQP_HOST=localhost
AMQP_PORT=5672
AMQP_USER=admin
AMQP_PASSWORD=secret
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

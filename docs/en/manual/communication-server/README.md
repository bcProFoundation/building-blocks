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

`communication-server` needs to have first client (app), i.e `communication-server` for administration dashboard for all apps, users, roles, scopes and general settings.

If a POST request with a body is sent to `http://accounts.localhost:3000/setup` response with required fields would be sent to url `http://accounts.localhost:4100` as per defined inside `./scripts/setupwiz.py`

- Run the script

```
./scripts/setupwiz.py add-client your@email.com secret http://admin.localhost:3000 "Communication Server" http://myaccount.localhost:4100
```
Above script would store the `clientId` and `clientSecret` from response to setup infrastructure console.

- sample
```
./scripts/setupwiz.py add-client prafful@mntechnique.com secret http://admin.localhost:3000 "Communication Server" http://myaccount.localhost:4100
```

- Expected response

```
<Response [201]>
```

Use Communication Server to setup personal and system Email Accounts.

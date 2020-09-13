### Prerequisites

- Kubernetes cluster is basic requirement. (Docker images for docker-compose/docker swarm are possible. They are not covered in documentation)
- `kubectl` and `helm` clients installed
- `mongo` client tools installed

### Prepare cluster

Refer Kubernetes [section](./create-namespace-for-repo.md) of documentation to setup namespaces and control access.

### Install MongoDB

MongoDB helm chart is installed in mongodb namespace as global-mongo (refer mongodb helm chart docs)

Create users for databases using mongo shell, we need users for four dbs; `authorization-server`, `communication-server`, `identity-provider` and `infrastructure-console`. Following is example command for creating a user for database.

Example command :

```shell
mongo accounts-example-com \
    --host $MONGO_HOSTS \
    --port 27017 \
    -u root \
    -p $MONGODB_ROOT_PASSWORD \
    --authenticationDatabase admin \
    --eval "db.createUser({user: 'accounts-example-com', pwd: 'secret', roles:[{role:'dbOwner', db: 'accounts-example-com'}]});"
```

Note: In case of managed db, you need to provide hostnames as env variables. No need to setup databases on cluster. Refer mongodb docs to create databases with user and password access.

### Events Service

All events are broadcasted to events service.

- Service is connected on host configured in `EVENTS_HOST` environment variable
- Port used for the connection is configured via `EVENTS_PORT`
- Events user is configured through `EVENTS_PASSWORD` environment variable
- Events password is configured through `EVENTS_PASSWORD` environment variable

### Set values.yaml

Use any editor and set the environment variables and values for the created/managed databases.

```shell
cp values.yaml ~/production-values.yaml
code ~/production-values.yaml
```

### Install Building Blocks

Refer README under kubernetes/helm-chart.
Use the modified values.yaml instead of the one on repo.

### letsencrypt and cert-manager

refer section for [Cert Manager and Letsencrypt](./cert-manager-letsencrypt.md)

### Run initialization setup

Make a `POST` http request to `/setup` endpoint of your authorization server

Or Use the python script provided in `building-blocks` root directory

```shell
## Setup authorization-server and infrastructure-console
./scripts/setupwiz.py setup-as https://accounts.example.com "Mr Admin" admin@example.com Secret@420710 +919420420420 https://admin.example.com

# Setup communication-server
./scripts/setupwiz.py add-client admin@example.com Secret@420710 https://admin.example.com "Communication Server" https://connect.example.com

# Setup identity-provider
./scripts/setupwiz.py add-client admin@example.com Secret@420710 https://admin.example.com "Identity Provider" https://myaccount.example.com
```

Explore infrastructure-console ui and set the desired settings, add system email. connect cloud storage for avatar, etc.

Note:

- `email` must be valid
- `phone` should be in valid ISO E.164 format
- `infrastructureConsoleUrl` is the url of infrastructure-console app
- `adminPassword` must be at least 10 character owasp compliant
- `issuerUrl` is the url of authorization server itself. It is used for jwks.
- Use environment variables instead of hard coded string in commands in case of automated deployments
- Make manual post request in case you dont need any other service e.g. infrastructure-console

### Setup Details

- Setup initializes everything, adds administrator and first oauth client called infrastructure-console
- Authentication, Authorization and setting up infrastructure is fairly synchronous
- Resource intensive jobs like clean ups, key pair generation during setup and fortnightly key pair refresh schedule is handled by mongo based queue
- All apps in building blocks use eventstore only to log events
- `communication-server` exposes endpoint to list streams for administrators
- eventstore can be used as audit log
- Events from building block related streams can be used by other event driven microservice

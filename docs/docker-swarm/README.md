# Docker Swarm Deployment

Docker swarm can be used on a single node as well as a cluster.
Easiest single server setup can be achieved using docker swarm setup.

## Prerequisites

- Setup Traefik and Portainer, refer [dockerswarm.rocks](https://dockerswarm.rocks)


### Setup MongoDB

Download the stack and setup environment variables.

```shell
wget https://gitlab.com/castlecraft/building-blocks/raw/main/docker/swarm/mongodb-stack.yml
wget https://gitlab.com/castlecraft/building-blocks/raw/main/docker/swarm/env-mongodb.sh
```

Change and source the variables as per need.
Set the database root password and one database with credentials.

```shell
nano env-mongodb.sh
source env-mongodb.sh
```

Deploy stack

```shell
docker stack deploy -c mongodb-stack.yml mongodb
```

Exec into MongoDB container and create databases for authorization-server, communication-server, identity-provider and infrastructure-console.

example command:

```shell
mongo authorization-server \
    --host localhost \
    --port 27017 \
    -u $MONGODB_PRIMARY_ROOT_USER \
    -p $MONGODB_ROOT_PASSWORD \
    --authenticationDatabase admin \
    --eval "db.createUser({user: 'authorization-server', pwd: 'changeit', roles:[{role:'dbOwner', db: 'authorization-server'}]});"
```

### Setup Building Blocks

Download the stack yaml and setup environment variables.

```shell
wget https://gitlab.com/castlecraft/building-blocks/raw/main/docker/swarm/building-blocks-stack.yml
wget https://gitlab.com/castlecraft/building-blocks/raw/main/docker/swarm/env-building-blocks.sh
```

Change and source the variables as per need.
Set the database host, credentials, domain names, version etc.

```shell
nano env-building-blocks.sh
source env-building-blocks.sh
```

Deploy stack

```shell
docker stack deploy -c building-blocks-stack.yml building-blocks
```

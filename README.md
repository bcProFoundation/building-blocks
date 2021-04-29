# Know More

- [Docs](http://castlecraft.gitlab.io/building-blocks)
- [Docker Images](https://gitlab.com/castlecraft/building-blocks/container_registry)

# Quickstart

This installs the infra locally using containers.

Download the `docker-compose.yml` file:

```shell
wget https://gitlab.com/castlecraft/building-blocks/-/raw/develop/docker/develop.yaml -O docker-compose.yml
```

Start the containers

```shell
docker-compose up -d
```

Initial Setup

```shell
docker run -it \
  --add-host accounts.localhost:172.17.0.1 \
  --add-host myaccount.localhost:172.17.0.1 \
  --add-host admin.localhost:172.17.0.1 \
  --add-host connect.localhost:172.17.0.1 \
  registry.gitlab.com/castlecraft/building-blocks/setup:latest # --help
```

Command will result in following output

```
Setting Up Authorization Server and Infrastructure Console

Creating Clients
Setup Identity Provider
Setup Communication Server

Update auth server settings for Example Inc.

Visit Admin URL http://admin.localhost:4220
Login using email 'admin@example.com' or phone '+919876543210'
Use the password configured during setup wizard, default password Secret@1234

URLs :
Authorization Server http://accounts.localhost:4210
Communication Server http://connect.localhost:4100
Identity Provider http://myaccount.localhost:4420
```

Tear down

```shell
docker-compose -f docker/develop.yaml stop
docker-compose -f docker/develop.yaml rm

# Caution: remove volumes of all stopped containers!
docker volume prune -f
```

# Know More

- [Docs](http://castlecraft.gitlab.io/building-blocks)
- [Docker Images](https://gitlab.com/castlecraft/building-blocks/container_registry)

# Quickstart

This installs the infra locally using containers.

Download the `docker-compose.yml` file:

```shell
git clone https://gitlab.com/castlecraft/building-blocks.git
cd building-blocks
```

Start the containers

```shell
docker-compose -f docker/develop.yaml up -d
```

Initial Setup

```shell
./scripts/setup-wizard
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

# Caution: clean volumes of all removed containers!
docker volume prune -f
```

# Know More

- [Docs](http://castlecraft.gitlab.io/building-blocks)
- [Docker Images](https://gitlab.com/castlecraft/building-blocks/container_registry)

# Quickstart

This installs the infra locally using containers.

Clone the repo:

```shell
git clone https://gitlab.com/castlecraft/building-blocks.git && cd building-blocks
```

Start the containers

```shell
docker-compose -f docker/develop.yaml up -d
```

Initial Setup

```shell
docker run -it \
  --add-host accounts.localhost:172.17.0.1 \
  --add-host myaccount.localhost:172.17.0.1 \
  --add-host admin.localhost:172.17.0.1 \
  --add-host connect.localhost:172.17.0.1 \
  --add-host \
  registry.gitlab.com/castlecraft/building-blocks/setup:latest # --help
```

Tear down

```shell
docker-compose -f docker/develop.yaml stop
docker-compose -f docker/develop.yaml rm

# Caution: remove volumes of all stopped containers!
docker volume prune -f
```

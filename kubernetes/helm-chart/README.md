# Helm Chart for Building Blocks

OAuth 2.1 and OIDC provider.

# Secrets to note and re-use during upgrade

Secret: `<release-name>-secrets` stores from following values

- authServer.dbPassword
- comServer.dbPassword
- idProvider.dbPassword
- infraConsole.dbPassword

Secret: `<release-name>-mongodb` stores from following values:

- mongodb.rootPassword
- mongodb.replicaSetKey

Secret: `<release-name>-redis-cluster` stores from following values

- redis-cluster.password

## Deploy with Redis and MongoDB

```sh
helm install core-bb castlecraft/blocks --namespace core \
    --set redis-cluster.enabled=true \
    --set mongodb.enabled=true
```

## Deploy with external Redis and MongoDB

```sh
helm install core-bb . --namespace core \
    --set redisHost="redis-cluster.redis.svc.cluster.local" \
    --set redis-cluster.password=changethis \
    --set mongoDBHost="global-mongodb-0.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-1.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-2.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-3.global-mongodb-headless.mongodb.svc.cluster.local" \
    --set authServer.dbPassword=changethis \
    --set comServer.dbPassword=changethis \
    --set idProvider.dbPassword=changethis \
    --set infraConsole.dbPassword=changethis
```

## Deploy with external Redis

```sh
helm install core-bb . --namespace core \
    --set redisHost="redis-cluster.redis.svc.cluster.local" \
    --set redis-cluster.password=changethis \
    --set mongodb.enabled=true \
    --set authServer.dbPassword=changethis \
    --set comServer.dbPassword=changethis \
    --set idProvider.dbPassword=changethis \
    --set infraConsole.dbPassword=changethis
```

## Deploy with external MongoDB

```sh
helm install core-bb . --namespace core \
    --set redis-cluster.enabled=true \
    --set mongoDBHost="global-mongodb-0.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-1.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-2.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-3.global-mongodb-headless.mongodb.svc.cluster.local" \
    --set authServer.dbPassword=changethis \
    --set comServer.dbPassword=changethis \
    --set idProvider.dbPassword=changethis \
    --set infraConsole.dbPassword=changethis
```

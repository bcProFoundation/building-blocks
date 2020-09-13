# Helm Chart for Building Blocks

OAuth 2.1 and OIDC provider.

## TL;DR;

```bash
$ helm repo add building-blocks https://castlecraft.gitlab.io/building-blocks

$ helm install core-bb --namespace core building-blocks/blocks \
    --set emqx.enabled=true \
    --set mongodb.enabled=true
```

## Introduction

This chart bootstraps a building blocks deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.


## Prerequisites

- Kubernetes 1.15+
- Helm 3.0+

## Installing the Chart

To install the chart with the release name `core-bb`:

```bash
$ helm install core-bb --namespace core building-blocks/blocks \
    --set emqx.enabled=true \
    --set mongodb.enabled=true
```

The command deploys building blocks on the Kubernetes cluster in the default configuration. The [Parameters](#parameters) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `core-bb` helm chart release:

```bash
$ helm --namespace core delete core-bb
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Parameters

The following table lists the configurable parameters of the MariaDB chart and their default values.

| Parameter                              | Description                                                  | Default                                                                      |
|----------------------------------------|--------------------------------------------------------------|------------------------------------------------------------------------------|
| mongoDBHost                            | Optional external Mongo DB host                              | nil                                                                          |
| eventsHost                             | Optional external Events host                                | nil                                                                          |
| imagePullSecrets                       | Docker image pull secrets                                    | `[]`                                                                         |
| environment                            | Application environment                                      | `production`                                                                 |
| authServer.enabled                     | Enable application service                                   | `true`                                                                       |
| authServer.replicaCount                | Number of replicas                                           | `1`                                                                          |
| authServer.cookieMaxAge                | Max Browser Cookie age                                       | `7889400000` as String                                                       |
| authServer.tokenValidity               | Oauth 2 bearer token validity                                | `3600` as String                                                             |
| authServer.sessionName                 | Name of vrowser session                                      | `AS_SESSION`                                                                 |
| authServer.dbName                      | Name of database, required in case of external database      | `as-db`                                                                      |
| authServer.dbUser                      | Name of database user, required in case of external database | `as-db`                                                                      |
| authServer.dbPassword                  | Database password, required in case of external database     | Random 10 character alphanumeric string                                      |
| authServer.backendImage.repository     | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/authorization-server         |
| authServer.backendImage.tag            | Application image tag                                        | `appVersion`                                                                 |
| authServer.backendImage.pullPolicy     | Application image pull policy                                | `IfNotPresent`                                                               |
| authServer.frontendImage.repository    | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/authorization-client         |
| authServer.frontendImage.tag           | Application image tag                                        | `appVersion`                                                                 |
| authServer.frontendImage.pullPolicy    | Application image pull policy                                | `IfNotPresent`                                                               |
| authServer.service.type                | Kubernetes `Service` type                                    | `ClusterIP`                                                                  |
| authServer.service.port                | Kubernetes `Service` port                                    | `8080` as Integer                                                            |
| authServer.ingress.enabled             | Enable `Ingress`                                             | `false`                                                                      |
| authServer.ingress.annotations         | `Ingress` annotations                                        | `{}`                                                                         |
| authServer.ingress.hosts[].host        | `Ingress` host, part of array of hosts                       | `auth-server.local`                                                          |
| authServer.ingress.hosts[].paths       | `Ingress` path, part of array of paths                       | `/`                                                                          |
| authServer.ingress.tls                 | TLS `Secret` name                                            | `[]`                                                                         |
| authServer.ingress.resources           | Pod resource allocation                                      | `{}`                                                                         |
| authServer.ingress.nodeSelector        | Pod node selector                                            | `{}`                                                                         |
| authServer.ingress.tolerations         | Pod tolerations                                              | `[]`                                                                         |
| authServer.ingress.affinity            | Pod affinity                                                 | `{}`                                                                         |
| comServer.enabled                      | Enable application service                                   | `true`                                                                       |
| comServer.replicaCount                 | Number of replicas                                           | `1`                                                                          |
| comServer.dbName                       | Name of database, required in case of external database      | `cs-db`                                                                      |
| comServer.dbUser                       | Name of database user, required in case of external database | `cs-db`                                                                      |
| comServer.dbPassword                   | Database password, required in case of external database     | Random 10 character alphanumeric string                                      |
| comServer.image.repository             | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/communication-server         |
| comServer.image.tag                    | Application image tag                                        | `appVersion`                                                                 |
| comServer.image.pullPolicy             | Application image pull policy                                | `IfNotPresent`                                                               |
| comServer.service.type                 | Kubernetes `Service` type                                    | `ClusterIP`                                                                  |
| comServer.service.port                 | Kubernetes `Service` port                                    | `4100` as Integer                                                            |
| comServer.ingress.enabled              | Enable `Ingress`                                             | `false`                                                                      |
| comServer.ingress.annotations          | `Ingress` annotations                                        | `{}`                                                                         |
| comServer.ingress.hosts[].host         | `Ingress` host, part of array of hosts                       | `com-server.local`                                                           |
| comServer.ingress.hosts[].paths        | `Ingress` path, part of array of paths                       | `/`                                                                          |
| comServer.ingress.tls                  | TLS `Secret` name                                            | `[]`                                                                         |
| comServer.ingress.resources            | Pod resource allocation                                      | `{}`                                                                         |
| comServer.ingress.nodeSelector         | Pod node selector                                            | `{}`                                                                         |
| comServer.ingress.tolerations          | Pod tolerations                                              | `[]`                                                                         |
| comServer.ingress.affinity             | Pod affinity                                                 | `{}`                                                                         |
| idProvider.enabled                     | Enable application service                                   | `true`                                                                       |
| idProvider.replicaCount                | Number of replicas                                           | `1`                                                                          |
| idProvider.dbName                      | Name of database, required in case of external database      | `ip-db`                                                                      |
| idProvider.dbUser                      | Name of database user, required in case of external database | `ip-db`                                                                      |
| idProvider.dbPassword                  | Database password, required in case of external database     | Random 10 character alphanumeric string                                      |
| idProvider.backendImage.repository     | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/identity-provider            |
| idProvider.backendImage.tag            | Application image tag                                        | `appVersion`                                                                 |
| idProvider.backendImage.pullPolicy     | Application image pull policy                                | `IfNotPresent`                                                               |
| idProvider.frontendImage.repository    | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/identity-client              |
| idProvider.frontendImage.tag           | Application image tag                                        | `appVersion`                                                                 |
| idProvider.frontendImage.pullPolicy    | Application image pull policy                                | `IfNotPresent`                                                               |
| idProvider.service.type                | Kubernetes `Service` type                                    | `ClusterIP`                                                                  |
| idProvider.service.port                | Kubernetes `Service` port                                    | `8080` as Integer                                                            |
| idProvider.ingress.enabled             | Enable `Ingress`                                             | `false`                                                                      |
| idProvider.ingress.annotations         | `Ingress` annotations                                        | `{}`                                                                         |
| idProvider.ingress.hosts[].host        | `Ingress` host, part of array of hosts                       | `id-server.local`                                                            |
| idProvider.ingress.hosts[].paths       | `Ingress` path, part of array of paths                       | `/`                                                                          |
| idProvider.ingress.tls                 | TLS `Secret` name                                            | `[]`                                                                         |
| idProvider.ingress.resources           | Pod resource allocation                                      | `{}`                                                                         |
| idProvider.ingress.nodeSelector        | Pod node selector                                            | `{}`                                                                         |
| idProvider.ingress.tolerations         | Pod tolerations                                              | `[]`                                                                         |
| idProvider.ingress.affinity            | Pod affinity                                                 | `{}`                                                                         |
| infraConsole.enabled                   | Enable application service                                   | `true`                                                                       |
| infraConsole.replicaCount              | Number of replicas                                           | `1`                                                                          |
| infraConsole.dbName                    | Name of database, required in case of external database      | `ic-db`                                                                      |
| infraConsole.dbUser                    | Name of database user, required in case of external database | `ic-db`                                                                      |
| infraConsole.dbPassword                | Database password, required in case of external database     | Random 10 character alphanumeric string                                      |
| infraConsole.backendImage.repository   | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/infrastructure-console       |
| infraConsole.backendImage.tag          | Application image tag                                        | `appVersion`                                                                 |
| infraConsole.backendImage.pullPolicy   | Application image pull policy                                | `IfNotPresent`                                                               |
| infraConsole.frontendImage.repository  | Application image                                            | registry.gitlab.com/castlecraft/building-blocks/admin-client                 |
| infraConsole.frontendImage.tag         | Application image tag                                        | `appVersion`                                                                 |
| infraConsole.frontendImage.pullPolicy  | Application image pull policy                                | `IfNotPresent`                                                               |
| infraConsole.service.type              | Kubernetes `Service` type                                    | `ClusterIP`                                                                  |
| infraConsole.service.port              | Kubernetes `Service` port                                    | `8080` as Integer                                                            |
| infraConsole.ingress.enabled           | Enable `Ingress`                                             | `false`                                                                      |
| infraConsole.ingress.annotations       | `Ingress` annotations                                        | `{}`                                                                         |
| infraConsole.ingress.hosts[].host      | `Ingress` host, part of array of hosts                       | `admin-server.local`                                                         |
| infraConsole.ingress.hosts[].paths     | `Ingress` path, part of array of paths                       | `/`                                                                          |
| infraConsole.ingress.tls               | TLS `Secret` name                                            | `[]`                                                                         |
| infraConsole.ingress.resources         | Pod resource allocation                                      | `{}`                                                                         |
| infraConsole.ingress.nodeSelector      | Pod node selector                                            | `{}`                                                                         |
| infraConsole.ingress.tolerations       | Pod tolerations                                              | `[]`                                                                         |
| infraConsole.ingress.affinity          | Pod affinity                                                 | `{}`                                                                         |
| emqx.enabled                           | Install emqx/emqx chart, with its values                     | `false`                                                                      |
| emqx.emqxConfig.EMQX_ALLOW_ANONYMOUS   | MQTT Allow anonymous connection                              | `false`                                                                      |
| emqx.emqxConfig.EMQX_LOADED_PLUGINS    | EMQX plugins                                                 | `"emqx_management,emqx_auth_mnesia,emqx_recon,emqx_retainer,emqx_dashboard"` |
| emqx.persistence.enabled               | Enable persistence                                           | `false`                                                                      |
| emqx.service.mqtt                      | EMQX MQTT port                                               | `1883`                                                                       |
| emqx.service.mgmt                      | EMQX Management port                                         | `8081`                                                                       |
| mqtt.user                              | MQTT username, required in case of external host             | nil                                                                          |
| mqtt.password                          | MQTT password, required in case of external host             | Random 10 character alphanumeric string                                      |
| createMqttUserJob.enabled              | Job to create MQTT user                                      | `true`                                                                       |
| createMqttUserJob.curlImage.repo       | Curl Image for create events user job                        | `byrnedo/alpine-curl`                                                        |
| createMqttUserJob.curlImage.tag        | curl image tag for create events user job                    | `latest`                                                                     |
| createMqttUserJob.curlImage.pullPolicy | Curl Image Pull Policy for create events user job            | `IfNotPresent`                                                               |
| mongodb.enabled                        | Install bitnami/mongodb chart, with its values               | `false`                                                                      |
| mongodb.architecture                   | MongoDB architecture. `standalone` or `replicaset`           | `replicaset`                                                                 |
| mongodb.auth.rootPassword              | MongoDB root password, required in case of external host     | Random 10 character alphanumeric string                                      |
| mongodb.auth.replicaSetKey             | MongoDB replicaset key                                       | Random 10 character alphanumeric string                                      |
| mongodb.replicaCount                   | Number of replicas                                           | `4`                                                                          |
| mongodb.pdb.create                     | Create Kuberentes Pod Distribution Budget                    | `true`                                                                       |
| mongodb.metrics.enabled                | Enable metrics sidecar                                       | `true`                                                                       |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

```bash
$ helm install core-bb --namespace core building-blocks/blocks \
    --set emqx.enabled=true \
    --set mongodb.enabled=true
```

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```bash
$ helm install core-bb -f values.yaml building-blocks/blocks
```

Note: Remember to enable ingress and specify hosts in case of production release.

## Secrets to note and re-use during upgrade

Secret: `<release-name>-secrets` stores from following values

- authServer.dbPassword
- comServer.dbPassword
- idProvider.dbPassword
- infraConsole.dbPassword

Secret: `<release-name>-mongodb` stores from following values:

- mongodb.rootPassword
- mongodb.replicaSetKey

Secret: `<release-name>-events` stores from following values

- emqx.password

## Examples

### Deploy with Events and MongoDB

```bash
$ helm install core-bb castlecraft/blocks --namespace core \
    --set emqx.enabled=true \
    --set mongodb.enabled=true
```

### Deploy with external Events and MongoDB

```bash
$ helm install core-bb . --namespace core \
    --set eventsHost="global-emqx.emqx.svc.cluster.local" \
    --set emqx.password=changethis \
    --set mongoDBHost="global-mongodb-0.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-1.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-2.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-3.global-mongodb-headless.mongodb.svc.cluster.local" \
    --set authServer.dbPassword=changethis \
    --set comServer.dbPassword=changethis \
    --set idProvider.dbPassword=changethis \
    --set infraConsole.dbPassword=changethis
```

### Deploy with external Events

```bash
$ helm install core-bb . --namespace core \
    --set eventsHost="global-emqx.emqx.svc.cluster.local" \
    --set emqx.password=changethis \
    --set mongodb.enabled=true \
    --set authServer.dbPassword=changethis \
    --set comServer.dbPassword=changethis \
    --set idProvider.dbPassword=changethis \
    --set infraConsole.dbPassword=changethis
```

### Deploy with external MongoDB

```bash
$ helm install core-bb . --namespace core \
    --set emqx.enabled=true \
    --set mongoDBHost="global-mongodb-0.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-1.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-2.global-mongodb-headless.mongodb.svc.cluster.local\,global-mongodb-3.global-mongodb-headless.mongodb.svc.cluster.local" \
    --set authServer.dbPassword=changethis \
    --set comServer.dbPassword=changethis \
    --set idProvider.dbPassword=changethis \
    --set infraConsole.dbPassword=changethis
```

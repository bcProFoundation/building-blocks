# Concurrency

- Containers can be scaled as per need.
- In case of kubernetes or docker swarm deployments, number of replicas can be increased.
- Datastore should be hosted separately or can be outsourced to managed host
- Caching service should be used separately as per the container requiring it. i.e. separate redis for each app requiring redis.

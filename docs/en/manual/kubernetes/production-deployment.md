### Prerequisites

- Kubernetes cluster is basic requirement. (Docker images for docker-compose/docker swarm are possible. They are not covered in documentation)
- `kubectl` and `helm` clients installed
- `mongo` client tools installed

### Prepare cluster

Refer Kubernetes [section](./create-namespace-for-repo.md) of documentation to setup namespaces.

MongoDB helm chart is installed in global-mongo namespace (refer mongodb helm chart docs)

Connect to mongo locally to created databases.

```sh
# export root password
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace mongodb global-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)

# port-forward database from cluster locally
kubectl port-forward --namespace mongodb svc/global-mongodb 27017:27017 &

# connect database using mongo client
mongo --host 127.0.0.1 --authenticationDatabase admin -p $MONGODB_ROOT_PASSWORD -u root
```

Create databases using mongo shell, we need four dbs for authorization-server, communication-server, identity-provider and infrastructure-console. Following is example command for creating a database.

```
mongo accounts-example-com \
    --host localhost \
    --port 27017 \
    -u root \
    -p $MONGODB_ROOT_PASSWORD \
    --authenticationDatabase admin \
    --eval "db.createUser({user: 'accounts-example-com', pwd: 'secret', roles:[{role:'dbOwner', db: 'accounts-example-com'}]});"
```

Note: In case of managed db, you need to provide hostnames as env variables. No need to setup databases on cluster. Refer mongodb docs to create databases with user and password access.

### Clone helm charts repository

```sh
git clone https://github.com/castlecraft/helm-charts
```

### Set values.yaml

Use any editor and set the environment variables and values for the created/managed databases.

```sh
code helm-charts/building-blocks/values.yaml
```

### Install Building Blocks

refer README https://github.com/castlecraft/helm-charts/tree/master/building-blocks
Use the modified values.yaml instead of the one on repo.

### letsencrypt and cert-manager

refer section for [Cert Manager and Letsencrypt](./cert-manager-letsencrypt.md)

### Run initialization setup

Make a `POST` http request to `/setup` endpoint of your authorization server

Or Use the python script provided in `building-blocks` root directory

```sh
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

Setup initializes everything, adds administrator, basic client.

It starts generating public private keys every 15 days for jwks.

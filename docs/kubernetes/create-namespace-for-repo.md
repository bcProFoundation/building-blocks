### Create namespace and namespace user

reference : https://jeremievallee.com/2018/05/28/kubernetes-rbac-namespace-user.html

```shell
wget -c https://gitlab.com/castlecraft/building-blocks/raw/develop/kubernetes/deploy/create-namespace-for-access/example-access.yaml
mv example-access.yaml <namespace>-access.yaml # change to your settings
kubectl create -f <namespace>-access.yaml # use changed file
```

### Get secrets

```shell
kubectl describe sa example-user -n example

example-user-token-xxxxx
```

### Get tokens

```shell
kubectl get secret example-user-token-xxxxx -n example -o "jsonpath={.data.token}" | base64 -d
```

### Get Certificate

```shell
kubectl get secret example-user-token-xxxxx -n example -o "jsonpath={.data['ca\.crt']}"
```

### Create Kube config

```yaml
# example-config.yaml
apiVersion: v1
kind: Config
preferences: {}

# Define the cluster
clusters:
- cluster:
    certificate-authority-data: PLACE PROVIDER CERTIFICATE HERE
    # You'll need the API endpoint of your Cluster here:
    server: https://YOUR_KUBERNETES_API_ENDPOINT
  name: my-cluster

# Define the user
users:
- name: example-user
  user:
    as-user-extra: {}
    client-key-data: PLACE USER CERTIFICATE HERE
    token: PLACE USER TOKEN HERE

# Define the context: linking a user to a cluster
contexts:
- context:
    cluster: my-cluster
    namespace: example
    user: example-user
  name: example

# Define current context
current-context: example
```

### Pack Config for gitlab / CI

```shell
cat example-config.yaml | base64 | pbcopy
```

To use configuration in CI, export it into an environment variable, base64 decode and use as config.

### Install Tiller

```shell
helm init --service-account example-user --tiller-namespace example
```

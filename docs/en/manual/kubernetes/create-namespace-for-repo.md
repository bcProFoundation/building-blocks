### Create namespace and namespace user

reference : https://jeremievallee.com/2018/05/28/kubernetes-rbac-namespace-user.html

```sh
kubectl create -f https://gitlab.com/castlecraft/building-blocks/raw/develop/helm-charts/deploy/create-namespace-for-access/example-access.yaml
```

### Get secrets

```sh
kubectl describe sa example-user -n example

example-user-token-xxxxx
```

### Get tokens

```sh
kubectl get secret example-user-token-xxxxx -n example -o "jsonpath={.data.token}" | base64 -d
```

### Get Certificate

```sh
kubectl get secret example-user-token-xxxxx -n example -o "jsonpath={.data['ca\.crt']}" | base64 -d
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
    certificate-authority-data: PLACE CERTIFICATE HERE
    # You'll need the API endpoint of your Cluster here:
    server: https://YOUR_KUBERNETES_API_ENDPOINT
  name: my-cluster

# Define the user
users:
- name: example-user
  user:
    as-user-extra: {}
    client-key-data: PLACE CERTIFICATE HERE
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

```sh
cat example-config.yaml | base64 | pbcopy
```

To use configuration in CI, export it into an environment variable, base64 decode and use as config.

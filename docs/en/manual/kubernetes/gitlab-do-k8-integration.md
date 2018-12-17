## Gitlab Kubernetes Integration

This example was setup using Digitalocean K8 Cluster

### Set KUBECONFIG for cluster provider

```sh
export KUBECONFIG=$HOME/Downloads/k8s-cluster-config.yaml
```

### Get certificate from KUBECONFIG

```sh
grep 'client-certificate-data' $KUBECONFIG | awk -F 'client-certificate-data: ' '{print $2}' | base64 -d
```

### Run following to get token for gitlab:

```sh
kubectl apply -f https://gitlab.com/castlecraft/building-blocks/raw/develop/helm-charts/deploy/gitlab-kubernetes/serviceaccount-gitlab.yaml
serviceaccount/gitlab created

kubectl apply -f https://gitlab.com/castlecraft/building-blocks/raw/develop/helm-charts/deploy/gitlab-kubernetes/clusterrolebinding-gitlab-cluster-admin.yaml
clusterrolebinding.rbac.authorization.k8s.io/gitlab-cluster-admin created

kubectl get secrets
NAME                  TYPE                                  DATA   AGE
default-token-54321   kubernetes.io/service-account-token   3      161m
gitlab-token-12345    kubernetes.io/service-account-token   3      2m15s

kubectl describe secrets gitlab-token-12345
...
token:      j.w.t
...

```

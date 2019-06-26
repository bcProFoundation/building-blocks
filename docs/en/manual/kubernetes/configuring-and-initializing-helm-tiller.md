## Configuring and initializing Helm Tiller

Run following commands

```sh
kubectl create -f https://gitlab.com/castlecraft/building-blocks/raw/develop/kubernetes/deploy/gitlab-kubernetes/rbac-config-helm-tiller.yaml

helm init --service-account tiller

# If your cluster previously had Helm/Tiller installed
helm init --upgrade --service-account tiller
```

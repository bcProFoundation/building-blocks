### Install

```
helm install --name building-blocks \
    --tiller-namespace building-blocks \
    --namespace building-blocks \
    --set sessionSecret=SuperSecretString \
    helm-charts/building-blocks
```

### Delete

```
helm del --purge building-blocks
```

### Upgrade

```
helm upgrade building-blocks \
    --tiller-namespace building-blocks \
    --namespace building-blocks \
    --reuse-values \
    --wait \
    helm-charts/building-blocks

```

### Other Resources

To install letsencrypt ssl along with cert-manager. (requires cert-manager and nginx-ingress installed)

```
# Create ClusterIssuer for domain
$ kubectl apply -f cert-manager-ingress/cluster-issuer.yaml

# Create Certificate
$ kubectl apply -f cert-manager-ingress/certificate.yaml
```

Notes:

- PersistentVolumeClaim for 1Gi for storing app data, mongodb data and redis' data
- annotations for ingress certmanager.k8s.io/cluster-issuer: letsencrypt-prod the issuer created above.
- Redis Chart is customised based on simple docker-compose like setup with no cluster

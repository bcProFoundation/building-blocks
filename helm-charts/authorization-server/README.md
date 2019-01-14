### Install

```
helm install --name authorization-server-staging \
    --tiller-namespace staging \
    --namespace staging \
    --set NODE_ENV=staging \
    --set sessionSecret=SuperSecretString \
    --set persistence.enabled=false \
    --set redis.master.persistence.enabled=false \
    --set mongodb.persistence.enabled=false \
    --set image.tag=edge \
    --set ingress.annotations."certmanager\.k8s\.io/cluster-issuer"=letsencrypt-prod \
    --set ingress.hosts={staging-accounts.castlecraft.in} \
    --set ingress.tls[0].secretName=accounts-castlecraft-in-staging-tls \
    --set ingress.tls[0].hosts={staging-accounts.castlecraft.in} \
    helm-charts/authorization-server
```

### Delete

```
helm del --purge authorization-server-staging
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

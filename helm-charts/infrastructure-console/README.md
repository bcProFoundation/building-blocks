### Install

```
helm install --name infrastructure-console-staging \
    --set NODE_ENV=staging \
    --namespace default \
    --set persistence.enabled=false \
    --set mongodb.persistence.enabled=false \
    --set image.tag=edge \
    --set ingress.annotations."certmanager\.k8s\.io/cluster-issuer"=letsencrypt-prod \
    --set ingress.hosts={staging-admin.castlecraft.in} \
    --set ingress.tls[0].secretName=admin-castlecraft-in-staging-tls \
    --set ingress.tls[0].hosts={staging-admin.castlecraft.in} \
    helm-charts/infrastructure-console
```

### Delete

```
helm del --purge infrastructure-console-staging
```

### Other Resources

To install letsencrypt ssl along with cert-manager. (requires cert-manager and nginx-ingress installed)

```
# Create ClusterIssuer for domain
$ kubectl apply -f cluster-issuer.yaml

# Create Certificate
$ kubectl apply -f certificate.yaml
```

Notes:

- PersistentVolumeClaim for 1Gi for storing app data, mongodb data and redis' data
- annotations for ingress certmanager.k8s.io/cluster-issuer: letsencrypt-prod the issuer created above.
- Redis Chart is customised based on simple docker-compose like setup with no cluster

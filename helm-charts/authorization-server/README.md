### Install

helm install --name authorization-server --set sessionSecret=superSecretstring .

### Delete

helm del --purge authorization-server

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
